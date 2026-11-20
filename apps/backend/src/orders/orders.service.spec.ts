import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersService } from './orders.service.js';

describe('OrdersService goods receipts', () => {
  const tx = {
    goodsReceipt: { findUnique: vi.fn(), create: vi.fn(), findUniqueOrThrow: vi.fn() },
    stockMovement: { findMany: vi.fn(), create: vi.fn() },
    user: { findFirst: vi.fn() },
    purchaseOrder: { findUnique: vi.fn(), update: vi.fn() },
    warehouseLocation: { findFirst: vi.fn() },
    inventory: { upsert: vi.fn() },
    purchaseOrderItem: { update: vi.fn(), findMany: vi.fn() },
  };
  const prisma = {
    $transaction: vi.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    goodsReceipt: { findMany: vi.fn(), count: vi.fn() },
  };
  const service = new OrdersService(prisma as unknown as PrismaService);
  beforeEach(() => vi.clearAllMocks());

  it('returns a prior receipt for an idempotent retry without posting stock again', async () => {
    const receipt = { id: 'grn-1', purchaseOrderId: 'po-1', items: [] };
    tx.goodsReceipt.findUnique.mockResolvedValue(receipt);
    await expect(service.receivePurchase('po-1', { createdById: 'user-1', idempotencyKey: 'receipt-key-1', items: [] })).resolves.toBe(receipt);
    expect(tx.inventory.upsert).not.toHaveBeenCalled();
    expect(tx.stockMovement.create).not.toHaveBeenCalled();
  });

  it('rejects duplicate purchase-order lines in one receipt', async () => {
    tx.goodsReceipt.findUnique.mockResolvedValue(null);
    tx.stockMovement.findMany.mockResolvedValue([]);
    const line = { purchaseOrderItemId: 'line-1', locationId: 'loc-1', quantity: 2 };
    await expect(service.receivePurchase('po-1', { createdById: 'user-1', idempotencyKey: 'receipt-key-2', items: [line, line] }))
      .rejects.toBeInstanceOf(ConflictException);
    expect(tx.inventory.upsert).not.toHaveBeenCalled();
  });

  it('returns paginated GRN history filtered by its search term', async () => {
    prisma.goodsReceipt.findMany.mockResolvedValue([]);
    prisma.goodsReceipt.count.mockResolvedValue(0);
    await service.listReceipts({ search: 'GRN-1', page: 1, pageSize: 20 });
    expect(prisma.goodsReceipt.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { OR: expect.arrayContaining([{ grnNumber: { contains: 'GRN-1', mode: 'insensitive' } }]) },
    }));
  });
});
