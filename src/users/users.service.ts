import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).populate('shopId').exec();
  }

  async create(data: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({ ...data, password: hashedPassword });
    return user.save();
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }
}
