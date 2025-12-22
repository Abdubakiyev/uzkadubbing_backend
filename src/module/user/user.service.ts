import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // CREATE USER
  async create(dto: CreateUserDto) {
    // EMAIL bo‘lsa unique bo‘lsin
    if (dto.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
  
      if (emailExists) {
        throw new BadRequestException('Email allaqachon mavjud');
      }
    }
  
    // USERNAME bo‘lsa unique bo‘lsin
    if (dto.username) {
      const usernameExists = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
  
      if (usernameExists) {
        throw new BadRequestException('Username allaqachon olingan');
      }
    }
  
    // PASSWORD OPTIONAL → agar berilgan bo‘lsa hash qilamiz, aks holda null
  
    // Foydalanuvchini yaratish
    return this.prisma.user.create({
      data: {
        email: dto.email || null,
        password: dto.password || null,
        firstName: dto.firstName || null,
        lastName: dto.lastName || null,
        username: dto.username || null,
        avatar: dto.avatar || null,
        role: dto.role || "USER",
        isSubscribed: dto.isSubscribed ?? false,
        isVerify: dto.isVerify ?? false,
      },
    });
  }  

  // GET ALL USERS (search + pagination)
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, // so'ng yaratilganidan boshlab
    });
  }  

  // GET SINGLE USER
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User topilmadi');
    return user;
  }

  // UPDATE USER
  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }
  async updateAvatar(id: string, avatarUrl: string) {
    await this.findOne(id);
  
    return this.prisma.user.update({
      where: { id },
      data: { avatar: avatarUrl },
    });
  }  

  // DELETE USER
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
