import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Foydalanuvchi email manzili',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'Foydalanuvchi paroli (kamida 6 ta belgi)',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: 'Abdulloh',
    description: 'Foydalanuvchining ismi',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Baxromov',
    description: 'Foydalanuvchining familiyasi',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'abdulloh_dev',
    description: 'Foydalanuvchi username (unique)',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar.jpg',
    description: 'Avatar URL manzili',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Foydalanuvchi roli',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    example: false,
    description: 'Foydalanuvchi obuna bo‘lganmi?',
  })
  @IsOptional()
  @IsBoolean()
  isSubscribed?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Email tasdiqlanganmi?',
  })
  @IsOptional()
  @IsBoolean()
  isVerify?: boolean;
}
