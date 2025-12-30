import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import slugify from 'slugify';

@Injectable()
export class AnimeService {
  constructor(private prisma: PrismaService) {}

  // ---------------- CREATE ----------------
  async create(dto: CreateAnimeDto) {
    const slug = slugify(dto.title, { lower: true });

    try {
      return await this.prisma.anime.create({
        data: {
          ...dto,
          slug,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.join(', ') || 'unique field';
        throw new BadRequestException(`Ushbu qiymat allaqachon mavjud: ${target}`);
      }
      throw error;
    }
  }

  // ---------------- FIND ALL ----------------
  async findAll() {
    return this.prisma.anime.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        episodes: true,
        comments: true,
      },
    });
  }

  // ---------------- FIND ONE ----------------
  async findOne(id: string) {
    const anime = await this.prisma.anime.findUnique({
      where: { id },
      include: {
        episodes: true,
        comments: true,
      },
    });

    if (!anime) throw new NotFoundException('Anime topilmadi');
    return anime;
  }

  // ---------------- INCREASE VIEW ----------------
  async increaseView(id: string) {
    const exists = await this.prisma.anime.findUnique({
      where: { id },
      select: { id: true },
    });
  
    if (!exists) {
      throw new NotFoundException('Anime topilmadi');
    }
  
    return this.prisma.anime.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  // ---------------- UPDATE ----------------
  async update(id: string, dto: UpdateAnimeDto) {
    const exists = await this.prisma.anime.findUnique({
      where: { id },
    });

    if (!exists) throw new NotFoundException('Anime topilmadi');

    // Agar title o‘zgargan bo‘lsa → slugni qayta yaratamiz
    let updatedSlug = exists.slug;
    if (dto.title) {
      updatedSlug = slugify(dto.title, { lower: true });
    }

    try {
      return await this.prisma.anime.update({
        where: { id },
        data: {
          ...dto,
          slug: updatedSlug,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.join(', ') || 'unique field';
        throw new BadRequestException(`Ushbu qiymat allaqachon mavjud: ${target}`);
      }
      throw error;
    }
  }

  // ---------------- REMOVE ----------------
  async remove(id: string) {
    const exists = await this.prisma.anime.findUnique({
      where: { id },
    });
  
    if (!exists) {
      throw new NotFoundException('Anime topilmadi');
    }
  
    return this.prisma.$transaction(async (tx) => {
      // Animega tegishli episode-larni olish
      const episodes = await tx.episode.findMany({
        where: { animeId: id },
        select: { id: true },
      });
  
      const episodeIds = episodes.map(e => e.id);
  
      // Commentslarni o'chirish (episodeId orqali)
      await tx.comment.deleteMany({
        where: { animeId: id },
      });
  
      // Episode-larni o'chirish
      await tx.episode.deleteMany({
        where: { animeId: id },
      });
  
      // Anime-ni o'chirish
      return tx.anime.delete({
        where: { id },
      });
    });
  }
   
}
