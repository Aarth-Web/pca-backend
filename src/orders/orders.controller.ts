import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ShopActiveGuard } from '../shops/guards/shop-active.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard, ShopActiveGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('shops/:id/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SHOPADMIN)
  create(
    @Param('id') shopId: string,
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ) {
    if (req.user.shopId._id !== shopId) {
      throw new UnauthorizedException(
        'You can only create orders for your own shop.',
      );
    }
    return this.ordersService.create(shopId, createOrderDto);
  }

  @Get('shops/:id/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SHOPADMIN)
  findAll(
    @Param('id') shopId: string,
    @Query('customerName') customerName: string,
    @Query('status') status: string,
    @Request() req,
  ) {
    if (req.user.shopId._id !== shopId) {
      throw new UnauthorizedException(
        'You can only view orders for your own shop.',
      );
    }
    return this.ordersService.findAllForShop(shopId, customerName, status);
  }

  @Patch('shops/:id/orders/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SHOPADMIN)
  update(
    @Param('id') shopId: string,
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    if (req.user.shopId._id !== shopId) {
      throw new UnauthorizedException(
        'You can only update orders for your own shop.',
      );
    }
    return this.ordersService.update(shopId, orderId, updateOrderDto);
  }

  @Delete('shops/:id/orders/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SHOPADMIN)
  remove(
    @Param('id') shopId: string,
    @Param('orderId') orderId: string,
    @Request() req,
  ) {
    if (req.user.shopId !== shopId) {
      throw new UnauthorizedException(
        'You can only delete orders for your own shop.',
      );
    }
    return this.ordersService.remove(shopId, orderId);
  }
}
