import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { SampleModule } from './sample/sample.module';

import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@common/database/database.module';
import { SchoolsModule } from '@schools/schools.module';
import { SubscribesModule } from '@subscribes/subscribes.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    SchoolsModule,
    UsersModule,
    SubscribesModule,
    SampleModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
