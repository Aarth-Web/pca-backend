import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './schemas/shop.schema';
import { UpdateShopDto } from './dto/update-shop.dto';
import { UserRole } from '../users/schemas/user.schema';

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

@Injectable()
export class ShopsService {
  constructor(
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    private usersService: UsersService,
  ) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const slug = slugify(createShopDto.name);
    const existingShop = await this.shopModel.findOne({ slug }).exec();
    if (existingShop) {
      throw new ConflictException('Shop name is already taken');
    }

    const owner = await this.usersService.create({
      name: createShopDto.name, // Or a specific owner name if provided
      email: createShopDto.ownerEmail,
      phone: createShopDto.ownerPhone,
      password: createShopDto.ownerPassword,
      role: UserRole.SHOPADMIN,
    });

    const newShop = new this.shopModel({
      ...createShopDto,
      slug,
      ownerId: owner._id,
    });

    const savedShop = await newShop.save();
    owner.shopId = savedShop;
    await owner.save();

    return savedShop;
  }

  async findAll(): Promise<Shop[]> {
    return this.shopModel.find().exec();
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopModel.findById(id).exec();
    if (!shop) {
      throw new NotFoundException(`Shop with ID "${id}" not found`);
    }
    return shop;
  }

  async findBySlug(slug: string): Promise<Shop> {
    const shop = await this.shopModel.findOne({ slug }).exec();
    if (!shop) {
      throw new NotFoundException(`Shop with slug "${slug}" not found`);
    }
    return shop;
  }

  async delete(id: string) {
    const deletedShop = await this.shopModel.findByIdAndDelete(id).exec();
    if (!deletedShop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
    // Optionally, delete the associated user
    await this.usersService.delete(deletedShop.ownerId.toString());
    return deletedShop;
  }

  async update(id: string, updateShopDto: UpdateShopDto): Promise<Shop> {
    const updatedShop = await this.shopModel.findByIdAndUpdate(
      id,
      updateShopDto,
      { new: true },
    );

    if (!updatedShop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
    return updatedShop;
  }
}
