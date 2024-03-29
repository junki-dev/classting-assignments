import { Controller, HttpStatus, Get, UseGuards, Post, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AggregateFeedBySchoolDto } from '@subscribes/dto/aggregate-feed-by-school.dto';
import { GetSubscribedFeedDto } from '@users/dto/get-subscribed-feed.dto';
import { GetSubscribedSchoolDto } from '@users/dto/get-subscribed-school.dto';
import { UserDocument } from '@users/models/user.schema';

@ApiTags('users')
@ApiSecurity('jwt')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    description: 'get user subscribed school pages',
    summary: 'get user subscribed school pages',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'subscribed school pages' })
  @Get('/subscriptions/schools')
  async getSubscribedSchool(@CurrentUser() user: UserDocument): Promise<GetSubscribedSchoolDto[]> {
    return this.usersService.getSubscribedSchool(user._id.toHexString());
  }

  @ApiOperation({
    description: "get user subscribed school's feeds",
    summary: "get user subscribed school's feeds",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "subscribed school's feeds" })
  @Get('/subscriptions/schools/feeds')
  async getSubscribedFeedBySchool(@CurrentUser() user: UserDocument): Promise<AggregateFeedBySchoolDto[]> {
    return this.usersService.getSubscribedFeedBySchool(user._id.toHexString());
  }

  @ApiOperation({
    description: 'get user subscribed feed by school id',
    summary: 'get user subscribed feed by school id',
  })
  @ApiResponse({ status: HttpStatus.OK, description: "subscribed school's feed" })
  @Get('/subscriptions/schools/:schoolId')
  async getSubscribedFeedBySchoolId(
    @CurrentUser() user: UserDocument,
    @Param('schoolId') schoolId: string,
  ): Promise<GetSubscribedFeedDto> {
    return this.usersService.getSubscribedFeedBySchoolId(user._id.toHexString(), schoolId);
  }

  @ApiOperation({
    description: 'subscribe school page',
    summary: 'subscribe school page',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'subscribed school page' })
  @Post('/subscriptions/schools/:schoolId')
  async subscribeSchoolPage(@CurrentUser() user: UserDocument, @Param('schoolId') schoolId: string) {
    return this.usersService.subscribeSchoolPage(user._id.toHexString(), schoolId);
  }

  @ApiOperation({
    description: 'unsubscribe school page',
    summary: 'unsubscribe school page',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'unsubscribe school page' })
  @Delete('/subscriptions/schools/:schoolId')
  async unsubscribeSchoolPage(@CurrentUser() user: UserDocument, @Param('schoolId') schoolId: string) {
    return this.usersService.unsubscribeSchoolPage(user._id.toHexString(), schoolId);
  }
}
