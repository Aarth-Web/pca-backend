import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
