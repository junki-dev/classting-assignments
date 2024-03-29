import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SchoolsService } from './schools.service';

import { Roles } from '@auth/decorators/roles.decorator';
import { RoleEnum } from '@auth/enum/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateFeedDto } from '@schools/dto/create-feed.dto';
import { CreateSchoolPageDto } from '@schools/dto/create-school-page.dto';
import { UpdateFeedDto } from '@schools/dto/update-feed.dto';
import { SchoolDocument } from '@schools/models/school.schema';
import { UserDocument } from '@users/models/user.schema';

@ApiTags('schools')
@ApiSecurity('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ApiOperation({ description: 'get all schools', summary: 'get all schools' })
  @ApiResponse({ status: HttpStatus.OK, description: `school page list` })
  @Get()
  getAllSchools(): Promise<SchoolDocument[]> {
    return this.schoolsService.getAllSchools();
  }

  @ApiOperation({ description: 'create a school page', summary: 'create a school page' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'succeed to create a school page' })
  @Post()
  @Roles(RoleEnum.ADMIN)
  createSchoolPage(@CurrentUser() user: UserDocument, @Body() createSchoolPageDto: CreateSchoolPageDto): Promise<void> {
    createSchoolPageDto.adminId = user._id;
    return this.schoolsService.createSchoolPage(createSchoolPageDto);
  }

  @ApiOperation({ description: 'create feed within a school page', summary: 'create feed within a school page' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'succeed to create a feed within a school page' })
  @Post('/feeds')
  @Roles(RoleEnum.ADMIN)
  createFeed(@CurrentUser() user: UserDocument, @Body() createNewsDto: CreateFeedDto): Promise<void> {
    createNewsDto.adminId = user._id;
    return this.schoolsService.createFeed(createNewsDto);
  }

  @ApiOperation({ description: 'update feed', summary: 'update feed' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: `succeed to update feed` })
  @Patch('/feeds/:feedId')
  @Roles(RoleEnum.ADMIN)
  updateFeed(
    @CurrentUser() user: UserDocument,
    @Param('feedId') feedId: string,
    @Body() updateFeedDto: UpdateFeedDto,
  ): Promise<void> {
    updateFeedDto.adminId = user._id;
    return this.schoolsService.updateFeed(feedId, updateFeedDto);
  }

  @ApiOperation({ description: 'delete feed', summary: 'delete feed' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: `succeed to delete feed` })
  @Delete('/feeds/:feedId')
  @Roles(RoleEnum.ADMIN)
  deleteFeed(@Param('feedId') feedId: string): Promise<void> {
    return this.schoolsService.deleteFeed(feedId);
  }
}
