import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { ShopsModule } from 'src/shops/shops.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [ShopsModule, OrdersModule],
  controllers: [PublicController],
})
export class PublicModule {}
