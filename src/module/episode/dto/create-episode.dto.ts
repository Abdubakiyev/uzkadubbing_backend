import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateEpisodeDto {
  @ApiProperty({
    example: '3f8f6f8d-92b6-4b51-9c44-8b123abcde12',
    description: 'Episod yozilayotgan Anime ID (UUID)',
  })
  @IsString()
  animeId: string;

  @ApiProperty({
    example: 'Episode 1: Ninja Beginning',
    description: 'Episod sarlavhasi',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'https://cdn.example.com/anime/naruto/episode1.mp4',
    description: 'Episod videosi URL manzili',
  })
  @IsString()
  videoUrl: string;
}
