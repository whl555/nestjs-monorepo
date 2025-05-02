import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaApi } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaApi: PrismaApi) {}

  async createUser(authDto: AuthCredentialsDto): Promise<User> {
    const existingUser = await this.prismaApi.user.findUnique({
      where: { email: authDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.prismaApi.user.create({
      data: {
        email: authDto.email,
        name: authDto.username,
        password: authDto.password,
      },
    });
  }
}
