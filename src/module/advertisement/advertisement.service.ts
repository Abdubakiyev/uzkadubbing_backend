import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AdvertisementService {
  constructor(private readonly prisma: PrismaService) {}

  // =================== CREATE ===================
  async create(dto: CreateAdvertisementDto) {
    // Episode mavjudligini tekshiramiz
    const episode = await this.prisma.episode.findUnique({
      where: { id: dto.episodeId },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    return this.prisma.advertisement.create({
      data: {
        video: dto.video,
        text: dto.text,
        link: dto.link,
        episodeId: dto.episodeId,
      },
    });
  }

  // =================== GET ALL ===================
  findAll() {
    return this.prisma.advertisement.findMany({
      include: {
        episode: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =================== GET ONE ===================
  async findOne(id: string) {
    const ad = await this.prisma.advertisement.findUnique({
      where: { id },
      include: {
        episode: true,
      },
    });

    if (!ad) {
      throw new NotFoundException('Advertisement not found');
    }

    return ad;
  }

  // =================== UPDATE ===================
  async update(id: string, dto: UpdateAdvertisementDto) {
    await this.findOne(id);

    // agar episodeId o‘zgartirilsa — tekshiramiz
    if (dto.episodeId) {
      const episode = await this.prisma.episode.findUnique({
        where: { id: dto.episodeId },
      });

      if (!episode) {
        throw new NotFoundException('Episode not found');
      }
    }

    return this.prisma.advertisement.update({
      where: { id },
      data: dto,
    });
  }

  // =================== DELETE ===================
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.advertisement.delete({
      where: { id },
      include: { episode: true }
    });
  }

  // =================== CREATE WITH VIDEO ===================
  async createWithVideo(
    episodeId: string,
    videoUrl: string,
    dto?: CreateAdvertisementDto,
  ) {
    const episode = await this.prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    return this.prisma.advertisement.create({
      data: {
        video: videoUrl,
        text: dto?.text,
        link: dto?.link,
        episodeId,
      },
      include: { episode: true },
    });
  }

  // =================== UPDATE VIDEO ===================
  async updateVideo(id: string, videoUrl: string) {
    await this.findOne(id);

    return this.prisma.advertisement.update({
      where: { id },
      data: {
        video: videoUrl,
      },
      include: { episode: true }
    });
  }

  // =================== GET ADS BY EPISODE ===================
  async findByEpisode(episodeId: string) {
    return this.prisma.advertisement.findMany({
      where: { episodeId },
      orderBy: { createdAt: 'asc' },
      include: { episode: true }
    });
  }
}
