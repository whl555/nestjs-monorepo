import { Global, Module } from '@nestjs/common';
import { PrismaApi } from './prisma.service';

@Global()
@Module({
  providers: [PrismaApi],
  exports: [PrismaApi],
})
export class PrismaModule {}
