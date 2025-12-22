import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateEpisodeDto) {
    return this.prisma.episode.create({ data: dto });
  }

  // FIND ALL
  async findAll(animeId?: string) {
    return this.prisma.episode.findMany({
      where: animeId ? { animeId } : undefined,
      orderBy: { createdAt: 'asc' },
      include: { anime: true },
    });
  }

  // FIND ONE
  async findOne(id: string) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { anime: true },
    });
    if (!episode) throw new NotFoundException('Episode topilmadi');
    return episode;
  }

  // UPDATE
  async update(id: string, dto: UpdateEpisodeDto) {
    const exists = await this.prisma.episode.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Episode topilmadi');

    return this.prisma.episode.update({ where: { id }, data: dto });
  }

  // DELETE
  async remove(id: string) {
    const exists = await this.prisma.episode.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Episode topilmadi');

    return this.prisma.episode.delete({ where: { id } });
  }
}
