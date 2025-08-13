import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ShopsService } from 'src/shops/shops.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private shopsService: ShopsService,
  ) {}

  async create(shopId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    await this.shopsService.findOne(shopId); // Verify shop exists
    const order = new this.orderModel({ ...createOrderDto, shopId });
    return order.save();
  }

  async findAllForShop(
    shopId: string,
    customerName?: string,
    status?: string,
  ): Promise<Order[]> {
    const query: any = { shopId };
    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }
    return this.orderModel.find(query).exec();
  }

  async update(
    shopId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderModel
      .findOneAndUpdate({ _id: orderId, shopId }, updateOrderDto, { new: true })
      .exec();
    if (!order) {
      throw new NotFoundException(
        `Order with ID "${orderId}" not found in this shop`,
      );
    }
    return order;
  }

  async remove(shopId: string, orderId: string): Promise<void> {
    const result = await this.orderModel
      .deleteOne({ _id: orderId, shopId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Order with ID "${orderId}" not found in this shop`,
      );
    }
  }

  async findPublicOrders(
    shopId: string,
    searchQuery?: string,
  ): Promise<Order[]> {
    const query: any = { shopId };
    if (searchQuery) {
      query.customerName = { $regex: searchQuery, $options: 'i' };
    }
    return this.orderModel.find(query).exec();
  }
}
