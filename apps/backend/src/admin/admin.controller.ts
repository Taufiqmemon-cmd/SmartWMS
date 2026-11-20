import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Patch, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

type SessionRequest = Request & { user: { id: string; role: string } };
const roles = ['ADMIN', 'MANAGER', 'SUPERVISOR', 'OPERATOR', 'VIEWER'] as const;
const defaultSettings = { companyName: 'SmartWMS', contactEmail: '', timezone: 'Asia/Kolkata', currency: 'INR', lowStockAlerts: true, negativeStockPolicy: false, valuationMethod: 'FIFO', purchaseOrderPrefix: 'PO-', salesOrderPrefix: 'SO-', sessionTimeoutMinutes: 480, theme: 'system' };

@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('overview')
  async overview(@Req() request: SessionRequest) {
    this.requireAdmin(request);
    const [totalUsers, activeUsers, warehouses, products, inventory] = await Promise.all([
      this.prisma.user.count(), this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.warehouse.count(), this.prisma.product.count(), this.prisma.inventory.count(),
    ]);
    return { totalUsers, activeUsers, inactiveUsers: totalUsers - activeUsers, warehouses, products, inventoryRecords: inventory };
  }

  @Get('users')
  async users(@Req() request: SessionRequest) {
    this.requireAdmin(request);
    return this.prisma.user.findMany({ select: { id: true, name: true, username: true, email: true, role: true, isActive: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 200 });
  }

  @Patch('users/:id')
  async updateUser(@Req() request: SessionRequest, @Body() body: unknown) {
    this.requireAdmin(request);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException('Request body must be an object');
    const data = body as Record<string, unknown>;
    const update: { role?: (typeof roles)[number]; isActive?: boolean } = {};
    if ('role' in data) {
      if (typeof data.role !== 'string' || !roles.includes(data.role as (typeof roles)[number])) throw new BadRequestException('Role is invalid');
      update.role = data.role as (typeof roles)[number];
    }
    if ('isActive' in data) {
      if (typeof data.isActive !== 'boolean') throw new BadRequestException('isActive must be true or false');
      update.isActive = data.isActive;
    }
    if (!Object.keys(update).length) throw new BadRequestException('Provide a role or active status to update');
    const targetId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    if (!targetId) throw new BadRequestException('User id is required');
    const target = await this.prisma.user.findUnique({ where: { id: targetId } });
    if (!target) throw new NotFoundException('User not found');
    if (target.id === request.user.id && (update.isActive === false || (update.role && update.role !== 'ADMIN'))) throw new BadRequestException('You cannot deactivate yourself or remove your own administrator role');
    if (target.role === 'ADMIN' && target.isActive && (update.isActive === false || (update.role && update.role !== 'ADMIN'))) {
      const admins = await this.prisma.user.count({ where: { role: 'ADMIN', isActive: true } });
      if (admins <= 1) throw new BadRequestException('The last active administrator cannot be deactivated or demoted');
    }
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({ where: { id: target.id }, data: update, select: { id: true, name: true, username: true, email: true, role: true, isActive: true, createdAt: true } });
      if (update.isActive === false) await tx.authSession.updateMany({ where: { userId: target.id, revokedAt: null }, data: { revokedAt: new Date() } });
      return user;
    });
  }

  @Get('settings')
  async settings(@Req() request: SessionRequest) {
    this.requireAdmin(request);
    const saved = await this.prisma.systemSetting.findUnique({ where: { id: 'global' } });
    return { ...defaultSettings, ...(saved?.value as Record<string, unknown> | undefined) };
  }

  @Patch('settings')
  async saveSettings(@Req() request: SessionRequest, @Body() body: unknown) {
    this.requireAdmin(request);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException('Settings must be an object');
    const incoming = body as Record<string, unknown>;
    const textFields = ['companyName', 'contactEmail', 'timezone', 'currency', 'valuationMethod', 'purchaseOrderPrefix', 'salesOrderPrefix'] as const;
    const merged: Record<string, unknown> = { ...defaultSettings };
    const saved = await this.prisma.systemSetting.findUnique({ where: { id: 'global' } });
    Object.assign(merged, saved?.value as Record<string, unknown> | undefined);
    for (const key of textFields) if (key in incoming) {
      if (typeof incoming[key] !== 'string' || incoming[key].length > 160) throw new BadRequestException(`${key} must be a text value up to 160 characters`);
      merged[key] = incoming[key].trim();
    }
    for (const key of ['lowStockAlerts', 'negativeStockPolicy'] as const) if (key in incoming) {
      if (typeof incoming[key] !== 'boolean') throw new BadRequestException(`${key} must be true or false`);
      merged[key] = incoming[key];
    }
    if ('sessionTimeoutMinutes' in incoming) {
      if (typeof incoming.sessionTimeoutMinutes !== 'number' || !Number.isInteger(incoming.sessionTimeoutMinutes) || incoming.sessionTimeoutMinutes < 15 || incoming.sessionTimeoutMinutes > 1440) throw new BadRequestException('Session timeout must be between 15 and 1440 minutes');
      merged.sessionTimeoutMinutes = incoming.sessionTimeoutMinutes;
    }
    if ('theme' in incoming) {
      if (!['light', 'dark', 'system'].includes(String(incoming.theme))) throw new BadRequestException('Theme must be light, dark, or system');
      merged.theme = incoming.theme;
    }
    if (!['FIFO', 'LIFO', 'WEIGHTED_AVERAGE'].includes(String(merged.valuationMethod))) throw new BadRequestException('Valuation method is invalid');
    if (!/^[A-Z]{3}$/.test(String(merged.currency))) throw new BadRequestException('Currency must be a three-letter currency code');
    const result = await this.prisma.systemSetting.upsert({ where: { id: 'global' }, create: { id: 'global', value: merged as Prisma.InputJsonValue }, update: { value: merged as Prisma.InputJsonValue } });
    return result.value;
  }

  private requireAdmin(request: SessionRequest) {
    if (request.user?.role !== 'ADMIN') throw new ForbiddenException('Administrator access required');
  }
}
