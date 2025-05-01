import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/createUser')
  async createUser(@Body() authDto: AuthCredentialsDto): Promise<User> {
    return this.authService.createUser(authDto);
  }
}
