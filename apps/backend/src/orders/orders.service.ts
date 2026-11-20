import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
export type OrderKind='purchase'|'sales';
type CreateInput=Record<string,any>;
@Injectable()
export class OrdersService {
 constructor(private readonly prisma:PrismaService){}
 private number(prefix:string){return `${prefix}-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${randomUUID().slice(0,8).toUpperCase()}`}
 async list(kind:OrderKind,filter:{status?:string;search?:string;page:number;pageSize:number}){
  const page=Math.max(1,filter.page),pageSize=Math.min(100,Math.max(1,filter.pageSize)),search=filter.search?.trim();
  if(kind==='purchase'){
   const where={...(filter.status?{status:filter.status as never}:{}),...(search?{OR:[{orderNumber:{contains:search,mode:'insensitive' as const}},{supplier:{name:{contains:search,mode:'insensitive' as const}}}] }:{})};
   const [data,total]=await Promise.all([this.prisma.purchaseOrder.findMany({where,skip:(page-1)*pageSize,take:pageSize,orderBy:{createdAt:'desc'},include:{supplier:true,warehouse:true,items:{include:{product:true}}}}),this.prisma.purchaseOrder.count({where})]);return{data,total,page,pageSize,pageCount:Math.ceil(total/pageSize)};
  }
  const where={...(filter.status?{status:filter.status as never}:{}),...(search?{OR:[{orderNumber:{contains:search,mode:'insensitive' as const}},{customer:{name:{contains:search,mode:'insensitive' as const}}}] }:{})};
  const [data,total]=await Promise.all([this.prisma.salesOrder.findMany({where,skip:(page-1)*pageSize,take:pageSize,orderBy:{createdAt:'desc'},include:{customer:true,warehouse:true,items:{include:{product:true,reservations:true}}}}),this.prisma.salesOrder.count({where})]);return{data,total,page,pageSize,pageCount:Math.ceil(total/pageSize)};
 }
 async get(kind:OrderKind,id:string){if(kind==='purchase'){const x=await this.prisma.purchaseOrder.findUnique({where:{id},include:{supplier:true,warehouse:true,items:{include:{product:true}}}});if(!x)throw new NotFoundException('Purchase order not found');return x}const x=await this.prisma.salesOrder.findUnique({where:{id},include:{customer:true,warehouse:true,items:{include:{product:true,reservations:{include:{inventory:{select:{locationId:true}}}}}}}});if(!x)throw new NotFoundException('Sales order not found');return x}
 async createPurchase(data:CreateInput){try{return await this.prisma.purchaseOrder.create({data:{orderNumber:this.number('PO'),supplier:{connect:{id:data.supplierId}},warehouse:{connect:{id:data.warehouseId}},expectedDelivery:data.expectedDelivery?new Date(data.expectedDelivery):undefined,notes:data.notes,items:{create:data.items.map((i:any)=>({product:{connect:{id:i.productId}},quantity:new Prisma.Decimal(i.quantity),unitCost:new Prisma.Decimal(i.unitCost)}))}},include:{supplier:true,warehouse:true,items:{include:{product:true}}}})}catch(e){this.handle(e)}}
 async createSales(data:CreateInput){try{return await this.prisma.salesOrder.create({data:{orderNumber:this.number('SO'),customer:{connect:{id:data.customerId}},warehouse:{connect:{id:data.warehouseId}},notes:data.notes,items:{create:data.items.map((i:any)=>({product:{connect:{id:i.productId}},quantity:new Prisma.Decimal(i.quantity),unitPrice:new Prisma.Decimal(i.unitPrice)}))}},include:{customer:true,warehouse:true,items:{include:{product:true}}}})}catch(e){this.handle(e)}}
 async receivePurchase(id:string,data:{createdById:string;idempotencyKey:string;items:Array<{purchaseOrderItemId:string;locationId:string;quantity:number|string}>}) {
  try {
   return await this.prisma.$transaction(async tx => {
    const existing=await tx.goodsReceipt.findUnique({where:{idempotencyKey:data.idempotencyKey},include:{items:{include:{product:true,location:true,purchaseOrderItem:true}},purchaseOrder:true,receivedBy:true}});
    if(existing){
     if(existing.purchaseOrderId!==id)throw new ConflictException('This idempotency key belongs to another purchase order');
     const same=existing.items.length===data.items.length&&existing.items.every((saved,index)=>saved.purchaseOrderItemId===data.items[index].purchaseOrderItemId&&saved.locationId===data.items[index].locationId&&new Prisma.Decimal(saved.quantity).eq(data.items[index].quantity));
     if(!same)throw new ConflictException('This idempotency key was already used for a different receipt payload');
     return existing;
    }
    const prefix=`receipt:${data.idempotencyKey}:`;
    const keys=data.items.map((_,index)=>`${prefix}${index}`);
    const prior=await tx.stockMovement.findMany({where:{operationKey:{in:keys}}});
    if(prior.length&&prior.length!==keys.length)throw new ConflictException('A partial idempotent receipt was detected; no further stock was posted');
    const legacyAlreadyPosted=prior.length===keys.length;
    if(new Set(data.items.map(item=>item.purchaseOrderItemId)).size!==data.items.length)throw new ConflictException('Each purchase order line may appear only once per receipt');
    const actor=await tx.user.findFirst({where:{id:data.createdById,isActive:true},select:{id:true}});
    if(!actor)throw new ConflictException('An active user is required to record receipt');
    const order=await tx.purchaseOrder.findUnique({where:{id},include:{items:true}});
    if(!order)throw new NotFoundException('Purchase order not found');
    if(!(['CONFIRMED','PARTIALLY_RECEIVED'].includes(order.status)||(legacyAlreadyPosted&&order.status==='RECEIVED')))throw new ConflictException('Only confirmed purchase orders can receive stock');
    const prepared=[] as Array<{line:(typeof order.items)[number];locationId:string;quantity:Prisma.Decimal}>;
    for(const input of data.items){
     const line=order.items.find(item=>item.id===input.purchaseOrderItemId);
     if(!line)throw new ConflictException('Receipt line does not belong to this purchase order');
     const quantity=new Prisma.Decimal(input.quantity);
     if(quantity.lte(0)||(!legacyAlreadyPosted&&new Prisma.Decimal(line.receivedQuantity).plus(quantity).gt(line.quantity)))throw new ConflictException('Receipt quantity exceeds the unreceived purchase order quantity');
     const location=await tx.warehouseLocation.findFirst({where:{id:input.locationId,warehouseId:order.warehouseId,isActive:true}});
     if(!location)throw new ConflictException('Receipt location must be active and belong to the purchase order warehouse');
     if(legacyAlreadyPosted){const movement=prior.find(row=>row.operationKey===keys[prepared.length]);if(!movement||movement.productId!==line.productId||movement.toLocationId!==location.id||!new Prisma.Decimal(movement.quantity).eq(quantity))throw new ConflictException('The idempotency key does not match the previously posted receipt');}
     prepared.push({line,locationId:location.id,quantity});
    }
    const grnNumber=this.number('GRN');
    const receipt=await tx.goodsReceipt.create({data:{grnNumber,idempotencyKey:data.idempotencyKey,purchaseOrderId:id,receivedById:actor.id,items:{create:prepared.map(item=>({purchaseOrderItemId:item.line.id,productId:item.line.productId,locationId:item.locationId,quantity:item.quantity,unitCost:item.line.unitCost}))}}});
    if(!legacyAlreadyPosted){
     for(let index=0;index<prepared.length;index++){
      const item=prepared[index];
      await tx.inventory.upsert({where:{productId_locationId:{productId:item.line.productId,locationId:item.locationId}},create:{productId:item.line.productId,locationId:item.locationId,quantity:item.quantity},update:{quantity:{increment:item.quantity}}});
      await tx.stockMovement.create({data:{productId:item.line.productId,warehouseId:order.warehouseId,toLocationId:item.locationId,createdById:actor.id,type:'INBOUND',quantity:item.quantity,reference:order.orderNumber,operationKey:keys[index],note:`Goods receipt ${grnNumber}`}});
      await tx.purchaseOrderItem.update({where:{id:item.line.id},data:{receivedQuantity:{increment:item.quantity}}});
     }
     const updatedLines=await tx.purchaseOrderItem.findMany({where:{purchaseOrderId:id}});
     const complete=updatedLines.every(item=>new Prisma.Decimal(item.receivedQuantity).gte(item.quantity));
     const any=updatedLines.some(item=>new Prisma.Decimal(item.receivedQuantity).gt(0));
     await tx.purchaseOrder.update({where:{id},data:{status:complete?'RECEIVED':any?'PARTIALLY_RECEIVED':'CONFIRMED'}});
    }
    return tx.goodsReceipt.findUniqueOrThrow({where:{id:receipt.id},include:{items:{include:{product:true,location:true,purchaseOrderItem:true}},purchaseOrder:{include:{supplier:true,warehouse:true}},receivedBy:true}});
   },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  } catch(error) { this.handle(error); }
 }
 async listReceipts(filter:{search?:string;page:number;pageSize:number}) {
  const page=Math.max(1,filter.page),pageSize=Math.min(100,Math.max(1,filter.pageSize)),search=filter.search?.trim();
  const where=search?{OR:[{grnNumber:{contains:search,mode:'insensitive' as const}},{purchaseOrder:{orderNumber:{contains:search,mode:'insensitive' as const}}},{purchaseOrder:{supplier:{name:{contains:search,mode:'insensitive' as const}}}}]}:{};
  const[data,total]=await Promise.all([this.prisma.goodsReceipt.findMany({where,skip:(page-1)*pageSize,take:pageSize,orderBy:{receivedAt:'desc'},include:{purchaseOrder:{include:{supplier:true,warehouse:true}},receivedBy:true,items:{include:{product:true,location:true}}}}),this.prisma.goodsReceipt.count({where})]);
  return{data,total,page,pageSize,pageCount:Math.ceil(total/pageSize)};
 } async updateDraft(kind:OrderKind,id:string,data:CreateInput){if(kind==='purchase'){const x=await this.get(kind,id);if(x.status!=='DRAFT')throw new ConflictException('Only draft purchase orders can be edited');return this.prisma.$transaction(async tx=>{await tx.purchaseOrderItem.deleteMany({where:{purchaseOrderId:id}});return tx.purchaseOrder.update({where:{id},data:{supplierId:data.supplierId,warehouseId:data.warehouseId,expectedDelivery:data.expectedDelivery?new Date(data.expectedDelivery):null,notes:data.notes,items:{create:data.items.map((i:any)=>({productId:i.productId,quantity:new Prisma.Decimal(i.quantity),unitCost:new Prisma.Decimal(i.unitCost)}))}},include:{items:true}})})}const x=await this.get(kind,id);if(x.status!=='DRAFT')throw new ConflictException('Only draft sales orders can be edited');return this.prisma.$transaction(async tx=>{await tx.salesOrderItem.deleteMany({where:{salesOrderId:id}});return tx.salesOrder.update({where:{id},data:{customerId:data.customerId,warehouseId:data.warehouseId,notes:data.notes,items:{create:data.items.map((i:any)=>({productId:i.productId,quantity:new Prisma.Decimal(i.quantity),unitPrice:new Prisma.Decimal(i.unitPrice)}))}},include:{items:true}})})}
 async action(kind:OrderKind,id:string,action:string,reason?:string){
  if(!['submit','confirm','cancel'].includes(action))throw new ConflictException('Supported actions are submit, confirm, and cancel');
  if(kind==='purchase'){
   const order=await this.get(kind,id);
   if(action==='submit'&&order.status==='DRAFT')return this.prisma.purchaseOrder.update({where:{id},data:{status:'SUBMITTED'}});
   if(action==='confirm'&&order.status==='SUBMITTED')return this.prisma.purchaseOrder.update({where:{id},data:{status:'CONFIRMED'}});
   if(action==='cancel'&&['DRAFT','SUBMITTED','CONFIRMED'].includes(order.status)){if(!reason?.trim())throw new ConflictException('A cancellation reason is required');return this.prisma.purchaseOrder.update({where:{id},data:{status:'CANCELLED',notes:[order.notes,'Cancellation reason: '+reason.trim()].filter(Boolean).join('\n')}});}
   throw new ConflictException(`Cannot ${action} a purchase order in ${order.status} status`);
  }
  if(action==='confirm')return this.confirmSales(id);
  if(action==='cancel'){if(!reason?.trim())throw new ConflictException('A cancellation reason is required');return this.cancelSales(id,reason.trim());}
  throw new ConflictException('Sales orders are confirmed or cancelled; submit is not a valid action');
 }
 private async confirmSales(id:string){
  try{return await this.prisma.$transaction(async tx=>{
   const order=await tx.salesOrder.findUnique({where:{id},include:{items:true}});if(!order)throw new NotFoundException('Sales order not found');if(order.status!=='DRAFT')throw new ConflictException('Only draft sales orders can be confirmed');
   for(const item of order.items){let remaining=new Prisma.Decimal(item.quantity);const stocks=await tx.inventory.findMany({where:{productId:item.productId,location:{warehouseId:order.warehouseId}},orderBy:{location:{code:'asc'}}});for(const stock of stocks){const available=new Prisma.Decimal(stock.quantity).minus(stock.reserved);if(available.lte(0))continue;const allocated=available.gte(remaining)?remaining:available;const changed=await tx.inventory.updateMany({where:{id:stock.id,quantity:stock.quantity,reserved:stock.reserved},data:{reserved:{increment:allocated}}});if(changed.count!==1)throw new ConflictException('Inventory changed while reserving stock; retry the order confirmation');await tx.inventoryReservation.create({data:{salesOrderItemId:item.id,inventoryId:stock.id,quantity:allocated}});remaining=remaining.minus(allocated);if(remaining.lte(0))break;}if(remaining.gt(0))throw new ConflictException(`Insufficient available stock for ${item.productId}`)}
   return tx.salesOrder.update({where:{id},data:{status:'CONFIRMED'},include:{customer:true,warehouse:true,items:{include:{product:true,reservations:true}}}})
  },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable})}catch(error){this.handle(error)}
 }
 private async cancelSales(id:string,reason:string){
  try{return await this.prisma.$transaction(async tx=>{const order=await tx.salesOrder.findUnique({where:{id},include:{items:true}});if(!order)throw new NotFoundException('Sales order not found');if(!['DRAFT','CONFIRMED'].includes(order.status))throw new ConflictException(`Cannot cancel a sales order in ${order.status} status`);const shipped=order.items.some(i=>!new Prisma.Decimal(i.shippedQuantity).isZero());if(shipped)throw new ConflictException('A partially shipped order cannot be cancelled from this action');const reservations=await tx.inventoryReservation.findMany({where:{salesOrderItem:{salesOrderId:id},releasedAt:null}});for(const r of reservations){const result=await tx.inventory.updateMany({where:{id:r.inventoryId,reserved:{gte:r.quantity}},data:{reserved:{decrement:r.quantity}}});if(result.count!==1)throw new ConflictException('Reservation balance changed; order cancellation was rolled back');await tx.inventoryReservation.update({where:{id:r.id},data:{releasedAt:new Date()}})}return tx.salesOrder.update({where:{id},data:{status:'CANCELLED',notes:[order.notes,'Cancellation reason: '+reason].filter(Boolean).join('\n')}})}, {isolationLevel:Prisma.TransactionIsolationLevel.Serializable})}catch(error){this.handle(error)}
 }
 private handle(error:unknown):never{if(typeof error==='object'&&error!==null&&'code'in error){if(error.code==='P2002')throw new ConflictException('Order number or idempotency reference already exists');if(error.code==='P2003')throw new ConflictException('Referenced record does not exist');if(error.code==='P2025')throw new NotFoundException('Order or referenced record not found');if(error.code==='P2034')throw new ConflictException('Concurrent inventory update detected; retry the operation')}throw error}
}
