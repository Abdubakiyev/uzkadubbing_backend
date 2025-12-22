import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AdvertisementService {
  constructor(private readonly prisma: PrismaService) {}

  // =================== CREATE ===================
  create(dto: CreateAdvertisementDto) {
    return this.prisma.advertisement.create({
      data: dto,
    });
  }

  // =================== GET ALL ===================
  findAll() {
    return this.prisma.advertisement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =================== GET ONE ===================
  async findOne(id: string) {
    const ad = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Advertisement not found');
    }
    return ad;
  }

  // =================== UPDATE ===================
  async update(id: string, dto: UpdateAdvertisementDto) {
    await this.findOne(id); // mavjudligini tekshirish

    return this.prisma.advertisement.update({
      where: { id },
      data: dto,
    });
  }

  // =================== DELETE ===================
  async remove(id: string) {
    await this.findOne(id); // mavjudligini tekshirish

    return this.prisma.advertisement.delete({
      where: { id },
    });
  }

  // =================== UPLOAD VIDEO URL INTEGRATION ===================
  // Agar video upload qilinsa va URL qabul qilinsa, reklama yaratish
  async createWithVideo(url: string, dto?: CreateAdvertisementDto) {
    const data = { ...dto, video: url };
    return this.prisma.advertisement.create({ data });
  }

  // Agar video upload qilingan va mavjud reklama update qilinishi kerak bo‘lsa
  async updateVideo(id: string, url: string) {
    await this.findOne(id);
    return this.prisma.advertisement.update({
      where: { id },
      data: { video: url },
    });
  }
}
