import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/core/mail/mail.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserRole } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  // -------------------------------------------------------------
  // 🔵 REGISTER
  // -------------------------------------------------------------
  async register(email: string, password: string, role: UserRole = UserRole.USER) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    // ---------------------------------------------
    // 🔹 USER OLDIN RO‘YXATDAN O‘TGAN BO‘LSA
    // ---------------------------------------------
    if (existingUser) {
      // agar password hali verify qilinmagan bo'lsa
      if (!existingUser.password) {
        throw new UnauthorizedException(
          'Siz hali emailni tasdiqlamadingiz. Iltimos, verify qiling'
        );
      }
    
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

    // ---------------------------------------------
    // 🔹 YANGI USER → OTP yuboriladi (user yaratilmaydi)
    // ---------------------------------------------
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.emailVerification.create({
      data: {
        email,
        password, // plain text
        role,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.mailService.sendVerificationEmail(email, code);

    return {
      message: 'Tasdiqlash kodi emailingizga yuborildi',
      redirectTo: '/verify',
    };
  }

  // -------------------------------------------------------------
  // 🔵 VERIFY CODE (faqat yangi user uchun)
  // -------------------------------------------------------------
  async verifyCode(email: string, code: string) {
    // user bo'lsa → verify ishlamaydi
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Bu email allaqachon ro‘yxatdan o‘tgan');
    }

    // verification topamiz
    const verification = await this.prisma.emailVerification.findFirst({
      where: { email, code, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      throw new BadRequestException("Kod noto‘g‘ri yoki muddati o‘tgan");
    }

    // ishlatilgan deb belgilash
    await this.prisma.emailVerification.update({
      where: { id: verification.id },
      data: { used: true },
    });

    // USERNI YARATAMIZ
    const user = await this.prisma.user.create({
      data: {
        email: verification.email,
        password: verification.password, // plain text
        role: verification.role,
        isVerify: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.role);

    return {
      userId: user.id,
      redirectTo:
        user.role === UserRole.ADMIN
          ? '/uzkadubbing/admin'
          : '/',
      tokens,
    };
  }

  // -------------------------------------------------------------
  // 🔵 RESEND CODE
  // -------------------------------------------------------------
  async resendVerificationCode(email: string) {
    const existing = await this.prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    if (!existing) {
      throw new NotFoundException('Email topilmadi');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.emailVerification.create({
      data: {
        email,
        password: existing.password, // plain text
        role: existing.role,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.mailService.sendVerificationEmail(email, code);

    return { message: 'Kod qayta yuborildi' };
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
