import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShopsService } from 'src/shops/shops.service';
import { OrdersService } from 'src/orders/orders.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly shopsService: ShopsService,
  ) {}

  @Get(':slug')
  async getShopBySlug(@Param('slug') slug: string) {
    return this.shopsService.findBySlug(slug);
  }

  @Get(':slug/orders')
  async getPublicOrders(
    @Param('slug') slug: string,
    @Query('search') searchQuery?: string,
  ) {
    const shop = await this.shopsService.findBySlug(slug);
    return this.ordersService.findPublicOrders(shop.id, searchQuery);
  }
}
