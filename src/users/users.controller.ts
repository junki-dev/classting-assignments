import { Controller, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserDocument } from '@users/models/user.schema';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'get login user data', summary: 'get login user data' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @Get()
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
