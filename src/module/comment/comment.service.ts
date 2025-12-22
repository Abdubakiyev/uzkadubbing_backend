import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(userId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        userId,
        animeId: dto.animeId,
        text: dto.text,
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        anime: { select: { id: true, title: true } },
      },
    });
  }

  // FIND ALL BY ANIME
  async findAll(animeId: string) {
    return this.prisma.comment.findMany({
      where: { animeId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        anime: { select: { id: true, title: true } },
      },
    });
  }

  // FIND ONE
  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        anime: { select: { id: true, title: true } },
      },
    });
    if (!comment) throw new NotFoundException('Comment topilmadi');
    return comment;
  }

  // UPDATE (faqat o‘z commenti)
  async update(userId: string, id: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment topilmadi');
    if (comment.userId !== userId) throw new ForbiddenException('Siz faqat o‘z commentingizni o‘zgartira olasiz');

    return this.prisma.comment.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        anime: { select: { id: true, title: true } },
      },
    });
  }

  // DELETE (faqat o‘z commenti)
  async remove(userId: string, id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment topilmadi');
    if (comment.userId !== userId) throw new ForbiddenException('Siz faqat o‘z commentingizni o‘chira olasiz');

    return this.prisma.comment.delete({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        anime: { select: { id: true, title: true } },
      },
    });
  }
}
