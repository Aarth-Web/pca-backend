import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../users/schemas/user.schema';
import { ShopsService } from '../shops.service';

@Injectable()
export class ShopActiveGuard implements CanActivate {
  constructor(private readonly shopsService: ShopsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === UserRole.SHOPADMIN) {
      if (!user.shopId) {
        throw new ForbiddenException('Shop is not assigned to this user.');
      }
      const shop = await this.shopsService.findOne(user.shopId);
      if (!shop || !shop.isActive) {
        throw new ForbiddenException('Shop is deactivated.');
      }
    }

    return true;
  }
}
