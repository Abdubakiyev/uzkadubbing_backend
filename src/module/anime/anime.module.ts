import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AnimeController],
  providers: [AnimeService],
})
export class AnimeModule {}
