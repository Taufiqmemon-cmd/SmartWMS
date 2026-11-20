import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
type Filter={search?:string;category?:string;brand?:string;status?:string;page?:number;pageSize?:number};
@Injectable()
export class ProductsService {
  constructor(private readonly prisma:PrismaService) {}
  async findAll(input:Filter|string={}) {
    const filter:Filter=typeof input==="string"?{search:input}:input;
    const term=filter.search?.trim();
    const where={...(filter.category?{category:filter.category}:{}),...(filter.brand?{brand:filter.brand}:{}),...(filter.status==='active'?{isActive:true}:filter.status==='inactive'?{isActive:false}:{}),...(term?{OR:[{sku:{contains:term,mode:'insensitive' as const}},{productCode:{contains:term,mode:'insensitive' as const}},{barcode:{contains:term,mode:'insensitive' as const}},{name:{contains:term,mode:'insensitive' as const}},{category:{contains:term,mode:'insensitive' as const}},{brand:{contains:term,mode:'insensitive' as const}}]}:{})};
    const include={inventory:{select:{quantity:true,reserved:true}},_count:{select:{inventory:true,movements:true}}};
    if(!filter.page&&!filter.pageSize)return this.prisma.product.findMany({where,orderBy:{name:'asc'},include});
    const page=Math.max(1,filter.page||1),pageSize=Math.min(100,Math.max(1,filter.pageSize||20));
    const[data,total]=await Promise.all([this.prisma.product.findMany({where,orderBy:{name:'asc'},skip:(page-1)*pageSize,take:pageSize,include}),this.prisma.product.count({where})]);
    return{data,total,page,pageSize,pageCount:Math.ceil(total/pageSize)};
  }
  async summary() {
    const[total,active,categoryRows,brandRows]=await Promise.all([
      this.prisma.product.count(),this.prisma.product.count({where:{isActive:true}}),
      this.prisma.product.findMany({distinct:['category'],where:{category:{not:null}},select:{category:true},orderBy:{category:'asc'}}),
      this.prisma.product.findMany({distinct:['brand'],where:{brand:{not:null}},select:{brand:true},orderBy:{brand:'asc'}}),
    ]);
    const categoryNames=categoryRows.map(x=>x.category).filter((x):x is string=>Boolean(x));
    const brandNames=brandRows.map(x=>x.brand).filter((x):x is string=>Boolean(x));
    return{total,active,inactive:total-active,totalSkus:total,categories:categoryNames.length,categoryNames,brandNames};
  }
  async findOne(id:string) {
    const row=await this.prisma.product.findUnique({where:{id},include:{inventory:{include:{location:{include:{warehouse:true}}}},movements:{orderBy:{createdAt:'desc'},take:50,include:{warehouse:true,fromLocation:true,toLocation:true}},_count:{select:{inventory:true,movements:true}}}});
    if(!row)throw new NotFoundException('Product not found');return row;
  }
  async create(data:Prisma.ProductCreateInput){try{return await this.prisma.product.create({data})}catch(e){this.handle(e)}}
  async update(id:string,data:Prisma.ProductUpdateInput){await this.findOne(id);try{return await this.prisma.product.update({where:{id},data})}catch(e){this.handle(e)}}
  async deactivate(id:string){await this.findOne(id);return this.prisma.product.update({where:{id},data:{isActive:false}})}
  private handle(e:unknown):never{if(typeof e==='object'&&e!==null&&'code'in e){if(e.code==='P2002')throw new ConflictException('SKU, product code, or barcode already exists');if(e.code==='P2025')throw new NotFoundException('Product not found')}throw e}
}
