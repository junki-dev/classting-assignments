import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GetUserDto } from '@users/dto/get-user.dto';
import { UserDocument } from '@users/models/user.schema';
import { UsersRepository } from '@users/users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * get user document
   * @param {GetUserDto} getUserDto   get user dto
   * @returns {Promise<UserDocument>} user document
   */
  async getUser(getUserDto: GetUserDto): Promise<UserDocument> {
    return this.usersRepository.findOne(getUserDto);
  }
}
