import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaApi } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaApi: PrismaApi) {}

  async createUser(authDto: AuthCredentialsDto): Promise<User> {
    try {
      const user = await this.prismaApi.user.create({
        data: {
          name: authDto.username,
          email: authDto.email,
          password: authDto.password,
        },
      });
      return Promise.resolve(user);
    } catch (error) {
      if (error.code === 'P2002') {
        return Promise.reject(new ConflictException('Email already exists'));
      }
      return Promise.reject(new InternalServerErrorException());
    }
  }
}
