import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSuperAdminDto } from './dto/register-superadmin.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register-superadmin')
  async registerSuperAdmin(
    @Body() registerSuperAdminDto: RegisterSuperAdminDto,
  ) {
    return this.authService.registerSuperAdmin(registerSuperAdminDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
