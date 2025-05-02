import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaApi } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaApi, // Inject PrismaService to use it in the controller
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getTasks() {
    return this.prismaService.task.findMany();
  }
}
