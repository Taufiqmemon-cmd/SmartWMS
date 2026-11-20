import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { InventoryService } from './inventory.service.js';

describe('InventoryService replenishment',()=>{
 const prisma={inventory:{findMany:vi.fn()}};const service=new InventoryService(prisma as unknown as PrismaService);beforeEach(()=>vi.clearAllMocks());
 it('groups location balances by product and warehouse and calculates target gap from available stock',async()=>{const product={id:'product-1',name:'Widget',sku:'W-1',unit:'PCS',minimumStock:'10',maximumStock:'20',costPrice:'2.50'};const warehouse={id:'warehouse-1',name:'Main',code:'WH-1'};prisma.inventory.findMany.mockResolvedValue([{productId:'product-1',quantity:'5',reserved:'1',product,location:{warehouseId:'warehouse-1',warehouse}},{productId:'product-1',quantity:'3',reserved:'1',product,location:{warehouseId:'warehouse-1',warehouse}}]);await expect(service.replenishment({warehouseId:'warehouse-1'})).resolves.toMatchObject([{availableQuantity:6,minimumStock:10,targetStock:20,suggestedQuantity:14,warehouse}]);expect(prisma.inventory.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({location:{warehouseId:'warehouse-1'}})}));});
});
