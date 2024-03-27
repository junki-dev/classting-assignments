import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SchoolsService } from './schools.service';

import { Roles } from '@auth/decorators/roles.decorator';
import { RoleEnum } from '@auth/enum/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { CreateNewsDto } from '@schools/dto/create-news.dto';
import { CreateSchoolPageDto } from '@schools/dto/create-school-page.dto';

@ApiTags('schools')
@ApiSecurity('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.Admin)
@Controller('schools')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ApiOperation({ description: 'create a school page', summary: 'create a school page' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'succeed to create a school page' })
  @Post()
  createSchoolPage(@Body() createSchoolDto: CreateSchoolPageDto) {
    return 'create a school page';
  }

  @ApiOperation({ description: 'create news within a school page', summary: 'create news within a school page' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'succeed to create a news within a school page' })
  @Post('/news')
  createNews(@Body() createNewsDto: CreateNewsDto) {
    return 'create news within a school page';
  }

  @ApiOperation({ description: 'get a school page by id', summary: 'get a school page by id' })
  @ApiResponse({ status: HttpStatus.OK, description: `school page` })
  @Get(':id')
  getSchoolById(@Param('id', ParseIntPipe) id: number) {
    return `get a school page by id, id=${id}`;
  }

  @ApiOperation({ description: 'update news', summary: 'update news' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: `succeed to update news` })
  @Patch('/news/:newsId')
  updateNews(@Param('newsId', ParseIntPipe) newsId: number) {
    return `update news, id=${newsId}`;
  }

  @ApiOperation({ description: 'delete news', summary: 'delete news' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: `succeed to delete news` })
  @Delete('/news/:newsId')
  deleteNews(@Param('newsId', ParseIntPipe) newsId: number) {
    return `delete news, id=${newsId}`;
  }
}
