import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { InventoryService } from './inventory.service.js';

describe('InventoryService', () => {
  const prisma = { inventory: { findMany: vi.fn(), count: vi.fn().mockResolvedValue(0) } };
  const service = new InventoryService(prisma as unknown as PrismaService);
  beforeEach(() => vi.clearAllMocks());

  it('returns product and warehouse location details with balances', async () => {
    prisma.inventory.findMany.mockResolvedValue([]);
    await service.findAll();
    expect(prisma.inventory.findMany).toHaveBeenCalledWith(expect.objectContaining({
      include: expect.objectContaining({ product: true, location: expect.any(Object) }),
    }));
  });

  it('applies warehouse and search filters together', async () => {
    prisma.inventory.findMany.mockResolvedValue([]);
    await service.findAll('widget', 'warehouse-1');
    const args = prisma.inventory.findMany.mock.calls[0][0];
    expect(args.where.location).toEqual(expect.objectContaining({ warehouseId: 'warehouse-1' }));
    expect(args.where.OR).toEqual(expect.arrayContaining([{ product: { sku: { contains: 'widget', mode: 'insensitive' } } }]));
  });
});
