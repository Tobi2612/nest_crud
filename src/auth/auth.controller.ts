// import { Controller, Post, Body, Request } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from '../modules/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() userData: UserAuthDto): Promise<any> {
    return this.authService.login(userData);
  }

  @Post('register')
  async register(@Body() userData: UserAuthDto): Promise<any> {
    return this.authService.register(userData);
  }

  @Post('admin/register')
  async admin_register(@Body() userData: UserAuthDto): Promise<any> {
    return this.authService.admin_register(userData);
  }
}
