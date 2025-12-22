import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserRole } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // -------------------------------------------------------------
  // 🔵 REGISTER / LOGIN
  // -------------------------------------------------------------
  async register(email: string, password: string, role: UserRole = UserRole.USER) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // agar parol noto‘g‘ri bo‘lsa
      if (existingUser.password !== password) {
        throw new UnauthorizedException('Parol noto‘g‘ri');
      }

      const tokens = this.generateTokens(existingUser.id, existingUser.role);

      return {
        userId: existingUser.id,
        redirectTo:
          existingUser.role === UserRole.ADMIN
            ? '/uzkadubbing/admin'
            : '/',
        tokens,
      };
    }

    // yangi user yaratish
    const user = await this.prisma.user.create({
      data: {
        email,
        password, // plain text yoki hash qilishingiz mumkin
        role,
        isVerify: true, // verify qilinmagan flag olib tashlandi
      },
    });

    const tokens = this.generateTokens(user.id, user.role);

    return {
      userId: user.id,
      redirectTo: user.role === UserRole.ADMIN ? '/uzkadubbing/admin' : '/',
      tokens,
    };
  }

  // -------------------------------------------------------------
  // 🔵 TOKEN GENERATOR
  // -------------------------------------------------------------
  generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
  }
}
