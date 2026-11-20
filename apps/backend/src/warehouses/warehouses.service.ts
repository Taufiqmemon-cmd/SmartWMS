import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { locations: true, movements: true } } },
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: { _count: { select: { locations: true, movements: true } } },
    });

    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async create(data: Prisma.WarehouseCreateInput) {
    try {
      return await this.prisma.warehouse.create({ data });
    } catch (error: unknown) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: string, data: Prisma.WarehouseUpdateInput) {
    await this.findOne(id);

    try {
      return await this.prisma.warehouse.update({ where: { id }, data });
    } catch (error: unknown) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.warehouse.delete({ where: { id } });
  }

  private handleDatabaseError(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('A warehouse with this code already exists');
    }

    throw error;
  }
}