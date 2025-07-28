import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [TasksModule, PrismaModule, AuthModule, LogModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
