import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { StockAuditsController } from './stock-audits.controller.js';
import { StockAuditsService } from './stock-audits.service.js';
@Module({imports:[PrismaModule],controllers:[StockAuditsController],providers:[StockAuditsService]})
export class StockAuditsModule {}
