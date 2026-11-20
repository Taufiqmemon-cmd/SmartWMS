import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service.js';

const fields = ['code', 'name', 'contactPerson', 'email', 'phone', 'address', 'city', 'state', 'country', 'taxNumber', 'paymentTerms', 'notes', 'isActive'];
function validate(body: unknown, partial = false): asserts body is Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException('Request body must be a JSON object');
  const data = body as Record<string, unknown>;
  const unknown = Object.keys(data).filter((key) => !fields.includes(key));
  if (unknown.length) throw new BadRequestException(`Unsupported field(s): ${unknown.join(', ')}`);
  if (partial ? !Object.keys(data).length : typeof data.code !== 'string' || !data.code.trim() || typeof data.name !== 'string' || !data.name.trim()) throw new BadRequestException(partial ? 'At least one field is required' : 'Supplier code and name are required');
  for (const key of fields) if (key in data && key !== 'isActive' && data[key] !== null && typeof data[key] !== 'string') throw new BadRequestException(`${key} must be a string or null`);
  if ('isActive' in data && typeof data.isActive !== 'boolean') throw new BadRequestException('isActive must be a boolean');
  for (const key of fields) if (typeof data[key] === 'string') data[key] = (data[key] as string).trim();
  if (typeof data.email === 'string' && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new BadRequestException('email must be valid');
}

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliers: SuppliersService) {}
  @Get('summary') summary() { return this.suppliers.summary(); }
  @Get() list(@Query('search') search?: string, @Query('status') status?: string, @Query('city') city?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.suppliers.list({ search, status, city, page: Number(page) || 1, pageSize: Number(pageSize) || 20 });
  }
  @Get(':id') get(@Param('id') id: string) { return this.suppliers.get(id); }
  @Post() create(@Body() body: unknown) { validate(body); return this.suppliers.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: unknown) { validate(body, true); return this.suppliers.update(id, body); }
  @Delete(':id') deactivate(@Param('id') id: string) { return this.suppliers.deactivate(id); }
}
