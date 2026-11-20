import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StockAuditsService } from './stock-audits.service.js';
@Controller('stock-audits')
export class StockAuditsController {
  constructor(private readonly audits:StockAuditsService){}
  @Get() list(@Query('search') search?:string,@Query('status') status?:string,@Query('page') page?:string,@Query('pageSize') pageSize?:string){return this.audits.list({search,status,page:Number(page)||1,pageSize:Number(pageSize)||20});}
  @Get(':id') get(@Param('id') id:string){return this.audits.get(id);}
  @Post() create(@Body() body:unknown){if(!body||typeof body!=='object'||Array.isArray(body))throw new BadRequestException('Request body must be an object');const d=body as Record<string,unknown>;if(typeof d.warehouseId!=='string'||typeof d.locationId!=='string'||typeof d.createdById!=='string'||Object.keys(d).some(k=>!['warehouseId','locationId','createdById','note'].includes(k)))throw new BadRequestException('warehouseId, locationId, createdById, and optional note are required');return this.audits.create(d as {warehouseId:string;locationId:string;createdById:string;note?:string});}
  @Patch(':id/items/:itemId') updateItem(@Param('id') id:string,@Param('itemId') itemId:string,@Body() body:unknown){if(!body||typeof body!=='object'||typeof (body as any).actorId!=='string'||!Number.isFinite(Number((body as any).countedQuantity))||Number((body as any).countedQuantity)<0)throw new BadRequestException('actorId and a non-negative countedQuantity are required');return this.audits.updateItem(id,itemId,(body as any).actorId,(body as any).countedQuantity);}
  @Post(':id/submit') submit(@Param('id') id:string,@Body() body:unknown){return this.audits.submit(id,this.actor(body));}
  @Post(':id/approve') approve(@Param('id') id:string,@Body() body:unknown){return this.audits.approve(id,{actorId:this.actor(body)});}
  @Post(':id/reject') reject(@Param('id') id:string,@Body() body:unknown){const d=this.object(body);if(typeof d.actorId!=='string'||typeof d.reason!=='string'||!d.reason.trim())throw new BadRequestException('actorId and rejection reason are required');return this.audits.reject(id,{actorId:d.actorId,reason:d.reason});}
  @Post(':id/post') post(@Param('id') id:string,@Body() body:unknown){return this.audits.post(id,this.actor(body));}
  @Post(':id/cancel') cancel(@Param('id') id:string,@Body() body:unknown){return this.audits.cancel(id,this.actor(body));}
  private actor(body:unknown){const d=this.object(body);if(typeof d.actorId!=='string'||!d.actorId)throw new BadRequestException('actorId is required');return d.actorId;}
  private object(body:unknown){if(!body||typeof body!=='object'||Array.isArray(body))throw new BadRequestException('Request body must be an object');return body as Record<string,unknown>;}
}
