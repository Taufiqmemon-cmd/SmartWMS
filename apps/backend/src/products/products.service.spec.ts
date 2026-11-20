import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  const prisma = { product: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() } };
  const service = new ProductsService(prisma as unknown as PrismaService);
  beforeEach(() => vi.clearAllMocks());

  it('searches product name, SKU, and barcode', async () => {
    prisma.product.findMany.mockResolvedValue([]);
    await service.findAll('cable');
    expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { OR: expect.arrayContaining([
      { sku: { contains: 'cable', mode: 'insensitive' } },
      { name: { contains: 'cable', mode: 'insensitive' } },
      { barcode: { contains: 'cable', mode: 'insensitive' } },
    ]) } }));
  });

  it('rejects duplicate SKU or barcode', async () => {
    prisma.product.create.mockRejectedValue({ code: 'P2002' });
    await expect(service.create({ sku: 'SKU-1', name: 'Cable' })).rejects.toBeInstanceOf(ConflictException);
  });
});
