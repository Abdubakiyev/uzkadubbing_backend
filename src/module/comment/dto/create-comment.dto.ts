import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: '3f8f6f8d-92b6-4b51-9c44-8b123abcde12',
    description: 'Comment yozilayotgan Anime ID (UUID)',
  })
  @IsString()
  animeId: string;

  @ApiProperty({
    example: 'Bu anime juda zo‘r!',
    description: 'Foydalanuvchi tomonidan yozilgan comment matni',
  })
  @IsString()
  text: string;
}
