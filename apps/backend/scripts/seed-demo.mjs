import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../dist/generated/prisma/client.js';

const targetCount = 50;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not configured.');
const databaseUrl = new URL(connectionString);
const databaseName = decodeURIComponent(databaseUrl.pathname.replace(/^\//, ''));
if (!['localhost', '127.0.0.1', '::1'].includes(databaseUrl.hostname) || databaseName !== 'smartwms' || process.env.NODE_ENV === 'production') {
  throw new Error('Demo seeding is limited to the local "smartwms" development database. No data was changed.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const pad = (number) => String(number).padStart(3, '0');

async function ensureWarehouse(index) {
  const code = `DEMO-WH-${pad(index)}`;
  return prisma.warehouse.upsert({
    where: { code },
    update: {},
    create: { code, name: `DEMO Warehouse ${pad(index)}`, address: `DEMO test facility ${pad(index)}, Pune, India` },
  });
}

async function ensureLocation(warehouseId, index) {
  const code = `DEMO-LOC-${pad(index)}`;
  return prisma.warehouseLocation.upsert({
    where: { warehouseId_code: { warehouseId, code } },
    update: {},
    create: {
      warehouseId, code, name: `DEMO Storage Location ${pad(index)}`, type: 'STORAGE',
      zone: 'DEMO', aisle: `A${pad(index)}`, rack: 'R01', shelf: 'S01', bin: `B${pad(index)}`,
      capacity: '1000.000', isActive: true,
    },
  });
}

async function ensureProduct(index) {
  const suffix = pad(index);
  return prisma.product.upsert({
    where: { sku: `DEMO-SKU-${suffix}` },
    update: {},
    create: {
      sku: `DEMO-SKU-${suffix}`, productCode: `DEMO-PROD-${suffix}`,
      name: `DEMO Warehouse Item ${suffix}`, description: `Clearly marked SmartWMS demo catalog record ${suffix}.`,
      category: ['Accessories', 'Packaging', 'Office Supplies', 'Safety'][((index - 1) % 4)],
      brand: `Demo Brand ${((index - 1) % 5) + 1}`, unit: 'PCS', costPrice: '100.00', sellingPrice: '150.00',
      minimumStock: '30.000', maximumStock: '100.000', isActive: true,
    },
  });
}

async function ensureSupplier(index) {
  const suffix = pad(index);
  return prisma.supplier.upsert({
    where: { code: `DEMO-SUP-${suffix}` },
    update: {},
    create: {
      code: `DEMO-SUP-${suffix}`, name: `DEMO Supplier ${suffix}`, contactPerson: `Demo Contact ${suffix}`,
      email: `supplier-${suffix}@example.test`, phone: `90000${String(index).padStart(5, '0')}`,
      city: 'Pune', state: 'Maharashtra', country: 'India', paymentTerms: 'Net 30',
      notes: 'DEMO record. Example data only.', isActive: true,
    },
  });
}

async function ensureCustomer(index) {
  const suffix = pad(index);
  return prisma.customer.upsert({
    where: { code: `DEMO-CUS-${suffix}` },
    update: {},
    create: {
      code: `DEMO-CUS-${suffix}`, name: `DEMO Customer ${suffix}`, contactPerson: `Demo Contact ${suffix}`,
      email: `customer-${suffix}@example.test`, phone: `91000${String(index).padStart(5, '0')}`,
      city: 'Pune', state: 'Maharashtra', country: 'India', address: `DEMO sample address ${suffix}`,
      isActive: true,
    },
  });
}

async function ensureReceiving(index, warehouse, location, product, supplier, actor) {
  const suffix = pad(index);
  const orderNumber = `DEMO-PO-${suffix}`;
  let order = await prisma.purchaseOrder.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) {
    order = await prisma.purchaseOrder.create({
      data: {
        orderNumber, supplierId: supplier.id, warehouseId: warehouse.id, status: 'CONFIRMED',
        expectedDelivery: new Date(Date.now() + index * 86_400_000), notes: 'DEMO purchase order. Example data only.',
        items: { create: [{ productId: product.id, quantity: '20.000', unitCost: '100.00' }] },
      }, include: { items: true },
    });
  }
  const idempotencyKey = `DEMO-GRN-KEY-${suffix}`;
  const existing = await prisma.goodsReceipt.findUnique({ where: { idempotencyKey } });
  if (!existing) {
    const orderItem = order.items.find((item) => item.productId === product.id);
    if (!orderItem || !['CONFIRMED', 'PARTIALLY_RECEIVED'].includes(order.status)) {
      throw new Error(`Cannot safely receive demo purchase order ${orderNumber}.`);
    }
    await prisma.$transaction(async (tx) => {
      const grnNumber = `DEMO-GRN-${suffix}`;
      await tx.goodsReceipt.create({ data: {
        grnNumber, idempotencyKey, purchaseOrderId: order.id, receivedById: actor.id,
        note: 'DEMO receipt. Example data only.',
        items: { create: [{ purchaseOrderItemId: orderItem.id, productId: product.id, locationId: location.id, quantity: '20.000', unitCost: orderItem.unitCost }] },
      } });
      await tx.inventory.upsert({
        where: { productId_locationId: { productId: product.id, locationId: location.id } },
        create: { productId: product.id, locationId: location.id, quantity: '20.000' },
        update: { quantity: { increment: '20.000' } },
      });
      await tx.stockMovement.create({ data: {
        productId: product.id, warehouseId: warehouse.id, toLocationId: location.id, createdById: actor.id,
        type: 'INBOUND', quantity: '20.000', reference: orderNumber,
        operationKey: `DEMO-GRN-MOVE-${suffix}`, note: `DEMO goods receipt ${grnNumber}`,
      } });
      await tx.purchaseOrderItem.update({ where: { id: orderItem.id }, data: { receivedQuantity: { increment: '20.000' } } });
      await tx.purchaseOrder.update({ where: { id: order.id }, data: { status: 'RECEIVED' } });
    });
  }
}

async function ensureSalesAndShipment(index, warehouse, location, product, customer) {
  const suffix = pad(index);
  const orderNumber = `DEMO-SO-${suffix}`;
  let order = await prisma.salesOrder.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) {
    order = await prisma.salesOrder.create({ data: {
      orderNumber, customerId: customer.id, warehouseId: warehouse.id, status: 'DRAFT',
      notes: 'DEMO sales order. Example data only.',
      items: { create: [{ productId: product.id, quantity: '1.000', unitPrice: '150.00' }] },
    }, include: { items: true } });
  }
  const orderItem = order.items.find((item) => item.productId === product.id);
  if (!orderItem) throw new Error(`Demo sales order ${orderNumber} has no matching item.`);
  const inventory = await prisma.inventory.findUnique({ where: { productId_locationId: { productId: product.id, locationId: location.id } } });
  if (!inventory) throw new Error(`Demo stock is missing for ${product.sku}.`);
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.inventoryReservation.findFirst({ where: { salesOrderItemId: orderItem.id, inventoryId: inventory.id, releasedAt: null } });
    if (!reservation) {
      const liveInventory = await tx.inventory.findUnique({ where: { id: inventory.id } });
      if (!liveInventory || Number(liveInventory.quantity) - Number(liveInventory.reserved) < 1) throw new Error(`Insufficient demo stock to reserve ${product.sku}.`);
      const changed = await tx.inventory.updateMany({ where: { id: inventory.id, quantity: liveInventory.quantity, reserved: liveInventory.reserved }, data: { reserved: { increment: '1.000' } } });
      if (changed.count !== 1) throw new Error(`Insufficient demo stock to reserve ${product.sku}.`);
      await tx.inventoryReservation.create({ data: { salesOrderItemId: orderItem.id, inventoryId: inventory.id, quantity: '1.000' } });
    }
    if (order.status === 'DRAFT') await tx.salesOrder.update({ where: { id: order.id }, data: { status: 'CONFIRMED' } });
    const shipmentNumber = `DEMO-SHP-${suffix}`;
    const shipment = await tx.shipment.findUnique({ where: { shipmentNumber } });
    if (!shipment) {
      const created = await tx.shipment.create({ data: {
        shipmentNumber, salesOrderId: order.id, status: 'READY', fulfillmentRequired: true,
        packageCount: 1, carrier: 'Demo Carrier', trackingNumber: `DEMO-TRACK-${suffix}`,
        shippingAddress: `DEMO delivery address ${suffix}, Pune`, expectedDelivery: new Date(Date.now() + 3 * 86_400_000),
        items: { create: [{ salesOrderItemId: orderItem.id, locationId: location.id, quantity: '1.000' }] },
      } });
      await tx.shipmentEvent.create({ data: { shipmentId: created.id, toStatus: 'READY', note: 'DEMO shipment created.' } });
    }
  });
}

async function ensureStockCount(index, warehouse, location, product, actor) {
  const suffix = pad(index);
  const countNumber = `DEMO-CNT-${suffix}`;
  const exists = await prisma.stockCount.findUnique({ where: { countNumber } });
  if (exists) return;
  const inventory = await prisma.inventory.findUnique({ where: { productId_locationId: { productId: product.id, locationId: location.id } } });
  await prisma.$transaction(async (tx) => {
    const count = await tx.stockCount.create({ data: {
      countNumber, warehouseId: warehouse.id, locationId: location.id, createdById: actor.id,
      status: 'OPEN', note: 'DEMO cycle count. Example data only.',
      items: { create: [{ productId: product.id, bookQuantity: inventory?.quantity ?? '0.000' }] },
    } });
    await tx.stockCountEvent.create({ data: { stockCountId: count.id, toStatus: 'OPEN', actorId: actor.id, note: 'DEMO count created.' } });
  });
}

async function countDemoRows() {
  const [warehouses, locations, products, suppliers, customers, purchaseOrders, receipts, salesOrders, shipments, stockCounts, movements, inventory] = await Promise.all([
    prisma.warehouse.count({ where: { code: { startsWith: 'DEMO-WH-' } } }),
    prisma.warehouseLocation.count({ where: { code: { startsWith: 'DEMO-LOC-' } } }),
    prisma.product.count({ where: { sku: { startsWith: 'DEMO-SKU-' } } }),
    prisma.supplier.count({ where: { code: { startsWith: 'DEMO-SUP-' } } }),
    prisma.customer.count({ where: { code: { startsWith: 'DEMO-CUS-' } } }),
    prisma.purchaseOrder.count({ where: { orderNumber: { startsWith: 'DEMO-PO-' } } }),
    prisma.goodsReceipt.count({ where: { grnNumber: { startsWith: 'DEMO-GRN-' } } }),
    prisma.salesOrder.count({ where: { orderNumber: { startsWith: 'DEMO-SO-' } } }),
    prisma.shipment.count({ where: { shipmentNumber: { startsWith: 'DEMO-SHP-' } } }),
    prisma.stockCount.count({ where: { countNumber: { startsWith: 'DEMO-CNT-' } } }),
    prisma.stockMovement.count({ where: { operationKey: { startsWith: 'DEMO-GRN-MOVE-' } } }),
    prisma.inventory.count({ where: { product: { sku: { startsWith: 'DEMO-SKU-' } } } }),
  ]);
  return { warehouses, locations, products, inventory, suppliers, customers, purchaseOrders, goodsReceipts: receipts, salesOrders, shipments, stockCounts, inboundMovements: movements };
}

try {
  const actor = await prisma.user.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' }, select: { id: true } });
  if (!actor) throw new Error('An existing active user is required for auditable demo receiving and cycle counts. No users were created.');

  for (let index = 1; index <= targetCount; index++) {
    const [warehouse, product, supplier, customer] = await Promise.all([
      ensureWarehouse(index), ensureProduct(index), ensureSupplier(index), ensureCustomer(index),
    ]);
    const location = await ensureLocation(warehouse.id, index);
    await ensureReceiving(index, warehouse, location, product, supplier, actor);
    await ensureSalesAndShipment(index, warehouse, location, product, customer);
    await ensureStockCount(index, warehouse, location, product, actor);
  }

  console.log(JSON.stringify({ message: 'DEMO records are ready. Existing records were preserved; no user accounts or settings were fabricated.', rows: await countDemoRows() }, null, 2));
} finally {
  await prisma.$disconnect();
}
