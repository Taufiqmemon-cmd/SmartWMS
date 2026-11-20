import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type ListOptions = { search?: string; status?: string; city?: string; page: number; pageSize: number };
@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}
  async list(options: ListOptions) {
    const page = Math.max(1, options.page);
    const pageSize = Math.min(100, Math.max(1, options.pageSize));
    const search = options.search?.trim();
    const where = {
      ...(options.status === 'active' ? { isActive: true } : options.status === 'inactive' ? { isActive: false } : {}),
      ...(options.city ? { city: { contains: options.city.trim(), mode: 'insensitive' as const } } : {}),
      ...(search ? { OR: ['code', 'name', 'contactPerson', 'email', 'phone', 'city'].map((field) => ({ [field]: { contains: search, mode: 'insensitive' as const } })) } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * pageSize, take: pageSize, include: { _count: { select: { purchaseOrders: true } } } }),
      this.prisma.supplier.count({ where }),
    ]);
    return { data, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
  }
  async summary() {
    const [total, active, pending, items] = await Promise.all([
      this.prisma.supplier.count(),
      this.prisma.supplier.count({ where: { isActive: true } }),
      this.prisma.purchaseOrder.count({ where: { status: { in: ['SUBMITTED', 'CONFIRMED', 'PARTIALLY_RECEIVED'] } } }),
      this.prisma.purchaseOrderItem.findMany({ select: { quantity: true, unitCost: true } }),
    ]);
    const purchaseValue = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitCost), 0);
    return { total, active, inactive: total - active, pendingPurchaseOrders: pending, purchaseValue };
  }
  async get(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id }, include: { purchaseOrders: { orderBy: { createdAt: 'desc' }, take: 20, include: { _count: { select: { items: true } } } } } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }
  async create(data: Record<string, unknown>) {
    try { return await this.prisma.supplier.create({ data: data as never }); } catch (error) { this.handle(error); }
  }
  async update(id: string, data: Record<string, unknown>) {
    await this.get(id);
    try { return await this.prisma.supplier.update({ where: { id }, data: data as never }); } catch (error) { this.handle(error); }
  }
  async deactivate(id: string) {
    await this.get(id);
    return this.prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }
  private handle(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') throw new ConflictException('Supplier code is already in use');
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') throw new NotFoundException('Supplier not found');
    throw error;
  }
}
