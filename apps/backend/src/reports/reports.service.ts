import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}
  async dashboard() {
    const [products, warehouses, pendingPurchaseOrders, pendingSalesOrders, inventory, recentMovements] = await Promise.all([
      this.prisma.product.findMany({ where: { isActive: true }, select: { id: true, sku: true, name: true, unit: true, minimumStock: true } }),
      this.prisma.warehouse.count(),
      this.prisma.purchaseOrder.count({ where: { status: { in: ['SUBMITTED', 'CONFIRMED', 'PARTIALLY_RECEIVED'] } } }),
      this.prisma.salesOrder.count({ where: { status: { in: ['DRAFT', 'CONFIRMED', 'PARTIALLY_SHIPPED'] } } }),
      this.prisma.inventory.findMany({ where: { product: { isActive: true } }, select: { productId: true, quantity: true, reserved: true, product: { select: { id: true, sku: true, name: true, unit: true, minimumStock: true } } } }),
      this.prisma.stockMovement.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { product: { select: { sku: true, name: true, unit: true } }, warehouse: { select: { code: true, name: true } } } }),
    ]);

    const productBalances = new Map<string, { product: typeof products[number]; quantity: number; reserved: number }>();
    let totalUnits = 0;
    let reservedUnits = 0;
    for (const row of inventory) {
      const quantity = Number(row.quantity);
      const reserved = Number(row.reserved);
      totalUnits += quantity;
      reservedUnits += reserved;
      const balance = productBalances.get(row.productId) ?? { product: row.product, quantity: 0, reserved: 0 };
      balance.quantity += quantity;
      balance.reserved += reserved;
      productBalances.set(row.productId, balance);
    }

    let healthy = 0;
    let lowStock = 0;
    let outOfStock = 0;
    const lowStockProducts: Array<{ id: string; name: string; sku: string; unit: string; available: number; minimum: number }> = [];
    for (const product of products) {
      const balance = productBalances.get(product.id) ?? { product, quantity: 0, reserved: 0 };
      const available = balance.quantity - balance.reserved;
      if (available <= 0) outOfStock++;
      else if (product.minimumStock !== null && available < Number(product.minimumStock)) {
        lowStock++;
        lowStockProducts.push({ id: product.id, name: product.name, sku: product.sku, unit: product.unit, available, minimum: Number(product.minimumStock) });
      } else healthy++;
    }
    lowStockProducts.sort((a, b) => (a.available - a.minimum) - (b.available - b.minimum));

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - 6);
    const movementRows = await this.prisma.stockMovement.findMany({
      where: { createdAt: { gte: startDate } },
      select: { type: true, quantity: true, fromLocationId: true, toLocationId: true, createdAt: true },
    });
    const trend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + index);
      const key = date.toISOString().slice(0, 10);
      return { date: key, label: new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'UTC' }).format(date), inbound: 0, outbound: 0 };
    });
    const trendByDate = new Map(trend.map((row) => [row.date, row]));
    for (const movement of movementRows) {
      const bucket = trendByDate.get(movement.createdAt.toISOString().slice(0, 10));
      if (!bucket) continue;
      const quantity = Number(movement.quantity);
      if (movement.type === 'INBOUND' || movement.type === 'RETURN' || (movement.type === 'ADJUSTMENT' && movement.toLocationId)) bucket.inbound += quantity;
      if (movement.type === 'OUTBOUND' || (movement.type === 'ADJUSTMENT' && movement.fromLocationId)) bucket.outbound += quantity;
    }

    return {
      generatedAt: new Date().toISOString(),
      totalProducts: products.length,
      warehouses,
      totalUnits,
      availableUnits: totalUnits - reservedUnits,
      reservedUnits,
      pendingOrders: pendingPurchaseOrders + pendingSalesOrders,
      inventoryHealth: { healthy, lowStock, outOfStock, total: products.length },
      lowStockProducts: lowStockProducts.slice(0, 6),
      movementTrend: trend,
      recentMovements,
    };
  }

  async summary() {
    const [warehouses, products, inventory, purchaseOrders, salesOrders, shipments, movements] = await Promise.all([
      this.prisma.warehouse.count(), this.prisma.product.count(),
      this.prisma.inventory.findMany({ include: { product: { select: { id: true, sku: true, minimumStock: true, costPrice: true } }, location: { select: { warehouseId: true } } } }),
      this.prisma.purchaseOrder.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.salesOrder.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.shipment.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.stockMovement.count(),
    ]);
    const byProduct = new Map<string, { quantity: number; minimum: number | null; cost: number | null }>();
    let totalUnits = 0; let reservedUnits = 0; let inventoryValue = 0; let valuedUnits = 0;
    for (const row of inventory) {
      const quantity = Number(row.quantity); const reserved = Number(row.reserved);
      totalUnits += quantity; reservedUnits += reserved;
      if (row.product.costPrice !== null) { inventoryValue += quantity * Number(row.product.costPrice); valuedUnits += quantity; }
      const current = byProduct.get(row.productId) ?? { quantity: 0, minimum: row.product.minimumStock === null ? null : Number(row.product.minimumStock), cost: row.product.costPrice === null ? null : Number(row.product.costPrice) };
      current.quantity += quantity; byProduct.set(row.productId, current);
    }
    const lowStock = [...byProduct.values()].filter((item) => item.minimum !== null && item.quantity > 0 && item.quantity < item.minimum).length;
    const outOfStock = [...byProduct.values()].filter((item) => item.quantity <= 0).length;
    const statusCount = (groups: Array<{ status: string; _count: { _all: number } }>) => Object.fromEntries(groups.map((g) => [g.status, g._count._all]));
    return { warehouses, products, totalUnits, reservedUnits, availableUnits: totalUnits - reservedUnits, lowStockItems: lowStock, outOfStockItems: outOfStock, inventoryValue: valuedUnits ? inventoryValue : null, inventoryValueCoverage: valuedUnits, purchaseOrders: statusCount(purchaseOrders), salesOrders: statusCount(salesOrders), shipments: statusCount(shipments), stockMovements: movements };
  }
  inventory(filters: { warehouseId?: string; locationId?: string; productId?: string; search?: string }) {
    const term = filters.search?.trim();
    return this.prisma.inventory.findMany({ where: {
      ...(filters.locationId ? { locationId: filters.locationId } : {}),
      ...(filters.productId ? { productId: filters.productId } : {}),
      ...(filters.warehouseId ? { location: { warehouseId: filters.warehouseId } } : {}),
      ...(term ? { OR: [{ product: { name: { contains: term, mode: 'insensitive' } } }, { product: { sku: { contains: term, mode: 'insensitive' } } }, { location: { code: { contains: term, mode: 'insensitive' } } }] } : {}),
    }, take: 5000, orderBy: [{ product: { name: 'asc' } }, { location: { code: 'asc' } }], include: { product: true, location: { include: { warehouse: true } } } });
  }
  movements(filters: { warehouseId?: string; type?: string; from?: string; to?: string }) {
    return this.prisma.stockMovement.findMany({ where: {
      ...(filters.warehouseId ? { warehouseId: filters.warehouseId } : {}),
      ...(filters.type ? { type: filters.type as never } : {}),
      ...(filters.from || filters.to ? { createdAt: { ...(filters.from ? { gte: new Date(filters.from) } : {}), ...(filters.to ? { lte: new Date(filters.to) } : {}) } } : {}),
    }, take: 5000, orderBy: { createdAt: 'desc' }, include: { product: true, warehouse: true, fromLocation: true, toLocation: true } });
  }
  async orders(from?: string, to?: string) {
    const where = from || to ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } } : undefined;
    const [purchaseOrders, salesOrders] = await Promise.all([
      this.prisma.purchaseOrder.findMany({ where, take: 2000, orderBy: { createdAt: 'desc' }, include: { supplier: true, warehouse: true, items: { include: { product: true } } } }),
      this.prisma.salesOrder.findMany({ where, take: 2000, orderBy: { createdAt: 'desc' }, include: { customer: true, warehouse: true, items: { include: { product: true } } } }),
    ]);
    return { purchaseOrders, salesOrders };
  }
  shipments(from?: string, to?: string) {
    const where = from || to ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } } : undefined;
    return this.prisma.shipment.findMany({ where, take: 5000, orderBy: { createdAt: 'desc' }, include: { salesOrder: { include: { customer: true } }, items: { include: { salesOrderItem: { include: { product: true } }, location: true } } } });
  }
}
