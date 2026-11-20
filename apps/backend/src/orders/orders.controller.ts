import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrdersService, type OrderKind } from './orders.service.js';

function validateCreate(body: unknown): asserts body is Record<string, any> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException('Request body must be a JSON object');
  const data=body as Record<string,any>;
  const allowed=['supplierId','customerId','warehouseId','expectedDelivery','notes','items'];
  const unknown=Object.keys(data).filter(k=>!allowed.includes(k)); if(unknown.length) throw new BadRequestException(`Unsupported field(s): ${unknown.join(', ')}`);
  if(typeof data.warehouseId!=='string'||!data.warehouseId.trim()) throw new BadRequestException('warehouseId is required');
  if(typeof data.supplierId!=='string'&&typeof data.customerId!=='string') throw new BadRequestException('A supplier or customer is required');
  if(!Array.isArray(data.items)||!data.items.length) throw new BadRequestException('At least one order item is required');
  for(const item of data.items){if(!item||typeof item.productId!=='string'||!item.productId.trim())throw new BadRequestException('Each item requires a productId');if(!Number.isFinite(Number(item.quantity))||Number(item.quantity)<=0)throw new BadRequestException('Item quantity must be greater than zero');const price=item.unitCost??item.unitPrice;if(!Number.isFinite(Number(price))||Number(price)<0)throw new BadRequestException('Item price must be zero or greater');}
}
@Controller('orders')
export class OrdersController {
 constructor(private readonly orders:OrdersService){}
 @Get('receipts') receipts(@Query('search') search?:string,@Query('page') page?:string,@Query('pageSize') pageSize?:string){return this.orders.listReceipts({search,page:Number(page)||1,pageSize:Number(pageSize)||20})}
 @Get() list(@Query('kind') kind?:string,@Query('status') status?:string,@Query('search') search?:string,@Query('page') page?:string,@Query('pageSize') pageSize?:string){return this.orders.list(kind==='sales'?'sales':'purchase',{status,search,page:Number(page)||1,pageSize:Number(pageSize)||20});}
 @Get(':kind/:id') get(@Param('kind') kind:OrderKind,@Param('id') id:string){return this.orders.get(kind,id)}
 @Post('purchase/:id/receive') receive(@Param('id') id:string,@Body() body:unknown){if(!body||typeof body!=='object'||Array.isArray(body))throw new BadRequestException('Request body must be an object');const d=body as Record<string,any>;if(typeof d.createdById!=='string'||typeof d.idempotencyKey!=='string'||!Array.isArray(d.items)||!d.items.length)throw new BadRequestException('createdById, idempotencyKey, and items are required');if(!/^[a-zA-Z0-9-]{8,80}$/.test(d.idempotencyKey))throw new BadRequestException('idempotencyKey must be 8-80 safe characters');for(const item of d.items)if(typeof item.purchaseOrderItemId!=='string'||typeof item.locationId!=='string'||!Number.isFinite(Number(item.quantity))||Number(item.quantity)<=0)throw new BadRequestException('Each receipt line needs an order item, location, and positive quantity');return this.orders.receivePurchase(id,d as {createdById:string;idempotencyKey:string;items:Array<{purchaseOrderItemId:string;locationId:string;quantity:number|string}>})}
 @Post('purchase') createPurchase(@Body() body:unknown){validateCreate(body);return this.orders.createPurchase(body)}
 @Post('sales') createSales(@Body() body:unknown){validateCreate(body);return this.orders.createSales(body)}
 @Post(':kind/:id/action') action(@Param('kind') kind:OrderKind,@Param('id') id:string,@Body() body:unknown){if(!body||typeof body!=='object'||!('action' in body)||typeof body.action!=='string')throw new BadRequestException('action is required');const d=body as {action:string;reason?:string};if(d.reason!==undefined&&typeof d.reason!=='string')throw new BadRequestException('reason must be text');return this.orders.action(kind,id,d.action,d.reason)}
 @Patch(':kind/:id') updateDraft(@Param('kind') kind:OrderKind,@Param('id') id:string,@Body() body:unknown){validateCreate(body);return this.orders.updateDraft(kind,id,body)}
}
