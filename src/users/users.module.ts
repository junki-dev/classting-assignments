import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { DatabaseModule } from '@common/database/database.module';
import { UserDocument, UserSchema } from '@users/models/user.schema';
import { UsersRepository } from '@users/users.repository';

@Module({
  imports: [DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
