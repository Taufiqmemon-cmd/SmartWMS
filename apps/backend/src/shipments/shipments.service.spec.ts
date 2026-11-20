import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { ShipmentsService } from './shipments.service.js';

describe('ShipmentsService pick and pack', () => {
  const tx = {
    user: { findFirst: vi.fn() },
    shipment: { findUnique: vi.fn(), update: vi.fn(), findUniqueOrThrow: vi.fn() },
    shipmentEvent: { findUnique: vi.fn(), create: vi.fn() },
    shipmentItem: { updateMany: vi.fn(), findMany: vi.fn() },
    inventory: { findUnique: vi.fn(), updateMany: vi.fn() },
  };
  const prisma = { $transaction: vi.fn((callback: (client: typeof tx) => unknown) => callback(tx)) };
  const service = new ShipmentsService(prisma as unknown as PrismaService);
  beforeEach(() => vi.clearAllMocks());

  it('does not dispatch a new shipment before packing is complete', async () => {
    tx.user.findFirst.mockResolvedValue({ id: 'operator-1' });
    tx.shipment.findUnique.mockResolvedValue({ id: 'shipment-1', status: 'PICKING', fulfillmentRequired: true });
    await expect(service.dispatch('shipment-1', 'operator-1')).rejects.toBeInstanceOf(ConflictException);
    expect(tx.inventory.updateMany).not.toHaveBeenCalled();
  });

  it('records pick quantities without deducting stock', async () => {
    tx.shipmentEvent.findUnique.mockResolvedValue(null);
    tx.user.findFirst.mockResolvedValue({ id: 'operator-1' });
    tx.shipment.findUnique.mockResolvedValue({ id: 'shipment-1', status: 'READY', fulfillmentRequired: true, items: [{ id: 'line-1', quantity: '5', pickedQuantity: '0', packedQuantity: '0' }] });
    tx.shipmentItem.updateMany.mockResolvedValue({ count: 1 });
    tx.shipmentItem.findMany.mockResolvedValue([{ id: 'line-1', quantity: '5', pickedQuantity: '5', packedQuantity: '0' }]);
    tx.shipment.update.mockResolvedValue({ id: 'shipment-1', status: 'PICKING' });
    await expect(service.pick('shipment-1', { createdById: 'operator-1', idempotencyKey: 'pick-key-0001', items: [{ shipmentItemId: 'line-1', quantity: 5 }] }))
      .resolves.toMatchObject({ status: 'PICKING' });
    expect(tx.shipmentEvent.create).toHaveBeenCalled();
    expect(tx.inventory.updateMany).not.toHaveBeenCalled();
  });
});
