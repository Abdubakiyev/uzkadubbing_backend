import { Controller, Get, Post, Body, Param, Patch, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/core/Guard/JwtGuard';

@ApiTags('Comments')          
@ApiBearerAuth('JWT-auth')    
@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  // 🔹 CREATE comment
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  create(@Req() req: any, @Body() dto: CreateCommentDto) {
    return this.service.create(req.user.id, dto);
  }

  // 🔹 FIND ALL BY ANIME (optional episodeId)
  @UseGuards(JwtAuthGuard)
  @Get('anime/:animeId')
  @ApiOperation({ summary: 'Get all comments for an anime (optional episode filter)' })
  @ApiQuery({ name: 'episodeId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of comments' })
  findAll(
    @Param('animeId') animeId: string,
    @Query('episodeId') episodeId?: string
  ) {
    return this.service.findAll(animeId, episodeId);
  }

  // 🔹 FIND ONE
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment details' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // 🔹 UPDATE comment
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully.' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.service.update(req.user.id, id, dto);
  }

  // 🔹 DELETE comment
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.id, id);
  }
}
