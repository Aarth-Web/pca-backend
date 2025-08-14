import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from 'src/users/schemas/user.schema';
import { RegisterSuperAdminDto } from './dto/register-superadmin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);

    if (user && (await bcrypt.compare(pass, user.password))) {
      if (
        user.role === UserRole.SHOPADMIN &&
        (!user.shopId || !user.shopId.isActive)
      ) {
        throw new UnauthorizedException('Shop is deactivated.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      phone: user.phone,
      sub: user._id,
      role: user.role,
      shopId: user.shopId._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async registerSuperAdmin(registerSuperAdminDto: RegisterSuperAdminDto) {
    const existingUser = await this.usersService.findByPhone(
      registerSuperAdminDto.phone,
    );
    if (existingUser) {
      throw new ConflictException('Phone number already exists');
    }
    return this.usersService.create({
      ...registerSuperAdminDto,
      role: UserRole.SUPERADMIN,
    });
  }
}
