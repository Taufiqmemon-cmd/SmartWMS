import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { WarehousesController } from './warehouses/warehouses.controller.js';
import { WarehousesService } from './warehouses/warehouses.service.js';
import { LocationsController } from './locations/locations.controller.js';
import { LocationsService } from './locations/locations.service.js';
import { ProductsController } from './products/products.controller.js';
import { ProductsService } from './products/products.service.js';
import { InventoryController } from './inventory/inventory.controller.js';
import { InventoryService } from './inventory/inventory.service.js';
import { SuppliersController } from './suppliers/suppliers.controller.js';
import { SuppliersService } from './suppliers/suppliers.service.js';
import { ReportsController } from './reports/reports.controller.js';
import { ReportsService } from './reports/reports.service.js';
import { OrdersController } from './orders/orders.controller.js';
import { OrdersService } from './orders/orders.service.js';
import { CustomersController } from './customers/customers.controller.js';
import { CustomersService } from './customers/customers.service.js';
import { ShipmentsController } from './shipments/shipments.controller.js';
import { ShipmentsService } from './shipments/shipments.service.js';
import { StockAuditsModule } from './stock-audits/stock-audits.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthGuard } from './auth/auth.guard.js';
import { AdminController } from './admin/admin.controller.js';
import { APP_GUARD } from '@nestjs/core';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    StockAuditsModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more â€” out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'api',
    }),
  ],
  controllers: [AppController, WarehousesController, LocationsController, ProductsController, InventoryController, SuppliersController, ReportsController, OrdersController, CustomersController, ShipmentsController, AdminController],
  providers: [AppService, WarehousesService, LocationsService, ProductsService, InventoryService, SuppliersService, ReportsService, OrdersService, CustomersService, ShipmentsService, { provide: APP_GUARD, useExisting: AuthGuard }],
})
export class AppModule {}


