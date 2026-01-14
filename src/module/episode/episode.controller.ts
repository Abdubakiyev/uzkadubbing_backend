import { 
    Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, UploadedFile, UseInterceptors 
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { EpisodeService } from './episode.service';
  import { CreateEpisodeDto } from './dto/create-episode.dto';
  import { UpdateEpisodeDto } from './dto/update-episode.dto';
  import { UserRole } from '@prisma/client';
  import { RolesGuard } from 'src/core/Guard/roles.guard';
  import { Roles } from 'src/core/Guard/roles.decorator';
  import { JwtAuthGuard } from 'src/core/Guard/JwtGuard';
  
  @ApiTags('Episodes')
  @ApiBearerAuth('JWT-auth')
  @Controller('episodes')
  export class EpisodeController {
    constructor(private readonly service: EpisodeService) {}
  
    // 🔹 CREATE – faqat ADMIN
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new episode (Admin only)' })
    @ApiResponse({ status: 201, description: 'Episode created successfully' })
    create(@Body() dto: CreateEpisodeDto) {
      return this.service.create(dto);
    }
  
    // 🔹 VIDEO UPLOAD – faqat ADMIN
    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload video for episode (Admin only)' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: { 
            type: 'string', 
            format: 'binary', 
            description: 'Video file to upload' 
          },
        },
      },
    })
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/episodes',
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
      }),
    }))
    uploadVideo(@UploadedFile() file: Express.Multer.File) {
      return { url: `https://uzkadubbingbackend-uzka.up.railway.app/uploads/episodes/${file.filename}` };
    }
  
    // 🔹 GET ALL – filter bo‘lishi mumkin (animeId orqali)
    @Get()
    @ApiOperation({ summary: 'Get all episodes' })
    @ApiResponse({ status: 200, description: 'List of all episodes' })
    findAll(@Query('animeId') animeId?: string) {
      return this.service.findAll(animeId);
    }
  
    // 🔹 GET ONE – bitta episode
    @Get(':id')
    @ApiOperation({ summary: 'Get a single episode by ID' })
    @ApiResponse({ status: 200, description: 'Episode details' })
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    // 🔹 UPDATE – faqat ADMIN
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update an episode (Admin only)' })
    @ApiResponse({ status: 200, description: 'Episode updated successfully' })
    update(@Param('id') id: string, @Body() dto: UpdateEpisodeDto) {
      return this.service.update(id, dto);
    }
  
    // 🔹 DELETE – faqat ADMIN
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete an episode (Admin only)' })
    @ApiResponse({ status: 200, description: 'Episode deleted successfully' })
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  