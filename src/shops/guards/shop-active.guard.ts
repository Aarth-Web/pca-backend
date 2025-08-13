import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class ShopActiveGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (user.role === UserRole.SHOPADMIN) {
      if (!user.shopId || !user.shopId.isActive) {
        throw new ForbiddenException('Shop is deactivated.');
      }
    }

    return true;
  }
}
