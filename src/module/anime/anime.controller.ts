import { 
  Controller, Get, Post, Body, Param, Patch, Delete, 
  UseGuards, UploadedFile, UseInterceptors, BadRequestException, 
  InternalServerErrorException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/core/Guard/roles.guard';
import { Roles } from 'src/core/Guard/roles.decorator';
import { JwtAuthGuard } from 'src/core/Guard/JwtGuard';

@ApiTags('Anime')
@ApiBearerAuth('JWT-auth')
@Controller('anime')
export class AnimeController {
  constructor(private readonly service: AnimeService) {}

  // 🔹 CREATE – faqat ADMIN (image faylsiz)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new anime (Admin only, without image upload)' })
  @ApiResponse({ status: 201, description: 'Anime created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateAnimeDto) {
    return this.service.create(dto);
  }

  // 🔹 IMAGE UPLOAD – faqat ADMIN
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image for anime (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Anime image file' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/anime-images',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split('.').pop();
        cb(null, `${unique}.${ext}`);
      },
    }),
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const url = `https://uzkadubbingbackend-uzka.up.railway.app/uploads/anime-images/${file.filename}`;
    return { url };
  }

  // 🔹 GET ALL – barcha userlar
  @Get()
  @ApiOperation({ summary: 'Get all anime' })
  @ApiResponse({ status: 200, description: 'List of all anime' })
  findAll() {
    return this.service.findAll();
  }

  // 🔹 GET ONE – barcha userlar
  @Get(':id')
  @ApiOperation({ summary: 'Get a single anime by ID' })
  @ApiResponse({ status: 200, description: 'Anime details' })
  @ApiResponse({ status: 404, description: 'Anime not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

    // 🔹 INCREASE VIEW – barcha userlar
    @Get(':id/view')
    @ApiOperation({ summary: 'Increase anime view count' })
    @ApiResponse({ status: 200, description: 'View count increased' })
    @ApiResponse({ status: 404, description: 'Anime not found' })
    increaseView(@Param('id') id: string) {
      return this.service.increaseView(id);
    }
  

  // 🔹 UPDATE – faqat ADMIN
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an anime (Admin only)' })
  @ApiResponse({ status: 200, description: 'Anime updated successfully' })
  @ApiResponse({ status: 404, description: 'Anime not found' })
  update(@Param('id') id: string, @Body() dto: UpdateAnimeDto) {
    return this.service.update(id, dto);
  }

  // 🔹 DELETE – faqat ADMIN
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an anime (Admin only)' })
  @ApiResponse({ status: 200, description: 'Anime deleted successfully' })
  @ApiResponse({ status: 404, description: 'Anime not found' })
  async remove(@Param('id') id: string) {
    try {
      return await this.service.remove(id);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Anime o‘chirishda xatolik yuz berdi');
    }
  }
}
