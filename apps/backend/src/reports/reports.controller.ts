import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}
  @Get('summary') summary() { return this.reports.summary(); }
  @Get('dashboard') dashboard() { return this.reports.dashboard(); }
  @Get('inventory') inventory(@Query('warehouseId') warehouseId?: string, @Query('locationId') locationId?: string, @Query('productId') productId?: string, @Query('search') search?: string) { return this.reports.inventory({ warehouseId, locationId, productId, search }); }
  @Get('movements') movements(@Query('warehouseId') warehouseId?: string, @Query('type') type?: string, @Query('from') from?: string, @Query('to') to?: string) { return this.reports.movements({ warehouseId, type, from, to }); }
  @Get('orders') orders(@Query('from') from?: string, @Query('to') to?: string) { return this.reports.orders(from, to); }
  @Get('shipments') shipments(@Query('from') from?: string, @Query('to') to?: string) { return this.reports.shipments(from, to); }
}
