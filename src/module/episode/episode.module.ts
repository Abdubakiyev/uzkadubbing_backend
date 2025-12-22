import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EpisodeController],
  providers: [EpisodeService],
})
export class EpisodeModule {}
