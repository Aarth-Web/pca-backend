import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Shop extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  upiId?: string;

  @Prop()
  qrCodeImageUrl?: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
