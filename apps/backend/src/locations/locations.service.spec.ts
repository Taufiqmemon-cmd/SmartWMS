import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { LocationsService } from './locations.service.js';

describe('LocationsService', () => {
  const prisma = {
    warehouseLocation: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const service = new LocationsService(prisma as unknown as PrismaService);

  beforeEach(() => vi.clearAllMocks());

  it('filters locations by warehouse and includes inventory counts', async () => {
    prisma.warehouseLocation.findMany.mockResolvedValue([]);
    prisma.warehouseLocation.count.mockResolvedValue(0);
    await service.findAll({ warehouseId: 'warehouse-1', page: 1, pageSize: 20 });
    expect(prisma.warehouseLocation.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { warehouseId: 'warehouse-1' },
      include: expect.objectContaining({ _count: { select: { inventory: true, outgoing: true, incoming: true } } }),
    }));
  });

  it('maps duplicate location codes to a conflict', async () => {
    prisma.warehouseLocation.create.mockRejectedValue({ code: 'P2002' });
    await expect(service.create({ code: 'A-01', warehouse: { connect: { id: 'warehouse-1' } } }))
      .rejects.toBeInstanceOf(ConflictException);
  });

  it('prevents deleting locations referenced by inventory or movements', async () => {
    prisma.warehouseLocation.findUnique.mockResolvedValue({ id: 'location-1' });
    prisma.warehouseLocation.delete.mockRejectedValue({ code: 'P2003' });
    await expect(service.remove('location-1')).rejects.toThrow(/referenced by inventory or stock movements/);
  });
});
