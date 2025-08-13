import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Shop } from '../../shops/schemas/shop.schema';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  SHOPADMIN = 'SHOPADMIN',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, unique: true, sparse: true })
  email?: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.SHOPADMIN })
  role: UserRole;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  shopId: Shop;
}

export const UserSchema = SchemaFactory.createForClass(User);
