import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  PREPARED = 'PREPARED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop', required: true })
  shopId: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ type: [Object], required: true })
  items: Record<string, any>[];

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ required: true })
  dueDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
