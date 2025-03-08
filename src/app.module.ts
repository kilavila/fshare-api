import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { FileModule } from './file/file.module';

@Module({
  imports: [FileModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
