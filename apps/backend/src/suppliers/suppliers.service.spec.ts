import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { SuppliersService } from './suppliers.service.js';

describe('SuppliersService', () => {
  const prisma = {
    supplier: { findMany: vi.fn(), count: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    purchaseOrder: { count: vi.fn() },
    purchaseOrderItem: { findMany: vi.fn() },
  };
  const service = new SuppliersService(prisma as unknown as PrismaService);
  beforeEach(() => vi.clearAllMocks());

  it('returns paginated supplier results with active search and city filters', async () => {
    prisma.supplier.findMany.mockResolvedValue([]);
    prisma.supplier.count.mockResolvedValue(0);
    await service.list({ search: 'Acme', city: 'Pune', status: 'active', page: 2, pageSize: 10 });
    expect(prisma.supplier.findMany.mock.calls[0][0]).toMatchObject({ skip: 10, take: 10, where: expect.objectContaining({ isActive: true, city: { contains: 'Pune', mode: 'insensitive' } }) });
  });

  it('deactivates rather than deleting the supplier', async () => {
    prisma.supplier.findUnique.mockResolvedValue({ id: 'supplier-1' });
    prisma.supplier.update.mockResolvedValue({ id: 'supplier-1', isActive: false });
    await service.deactivate('supplier-1');
    expect(prisma.supplier.update).toHaveBeenCalledWith({ where: { id: 'supplier-1' }, data: { isActive: false } });
  });
});
