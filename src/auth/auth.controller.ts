import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, PickType } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { SignUpDto } from '@auth/dto/sign-up.dto';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserDocument } from '@users/models/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'create user data', summary: 'create user data' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'CREATED' })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<UserDocument> {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ description: 'login user', summary: 'login user' })
  @ApiBody({ type: PickType(UserDocument, ['email', 'password']) })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'jwt token' })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@CurrentUser() user: UserDocument) {
    return this.authService.signIn(user);
  }
}
