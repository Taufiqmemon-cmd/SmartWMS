import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { WarehousesService } from './warehouses.service.js';

function validateWarehouseBody(body: unknown, partial = false): asserts body is Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('Request body must be a JSON object');
  }

  const data = body as Record<string, unknown>;
  const allowed = ['code', 'name', 'address'];
  const unknownFields = Object.keys(data).filter((key) => !allowed.includes(key));

  if (unknownFields.length > 0) {
    throw new BadRequestException(`Unsupported field(s): ${unknownFields.join(', ')}`);
  }

  if (!partial && (!('code' in data) || !('name' in data))) {
    throw new BadRequestException('Warehouse code and warehouse name are required');
  }

  if (partial && Object.keys(data).length === 0) {
    throw new BadRequestException('At least one field is required for update');
  }

  for (const field of ['code', 'name']) {
    if (field in data && (typeof data[field] !== 'string' || !(data[field] as string).trim())) {
      throw new BadRequestException(`${field} must be a non-empty string`);
    }
  }

  if ('address' in data && data.address !== null && typeof data.address !== 'string') {
    throw new BadRequestException('address must be a string or null');
  }

  if (typeof data.code === 'string') data.code = data.code.trim();
  if (typeof data.name === 'string') data.name = data.name.trim();
  if (typeof data.address === 'string') data.address = data.address.trim();
}

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Post()
  create(@Body() body: unknown) {
    validateWarehouseBody(body);
    return this.warehousesService.create(body as Prisma.WarehouseCreateInput);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    validateWarehouseBody(body, true);
    return this.warehousesService.update(id, body as Prisma.WarehouseUpdateInput);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}