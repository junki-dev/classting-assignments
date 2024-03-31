import { Module } from '@nestjs/common';

import { SampleService } from './sample.service';

import { SchoolsModule } from '@schools/schools.module';
import { SubscribesModule } from '@subscribes/subscribes.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [SchoolsModule, UsersModule, SubscribesModule],
  providers: [SampleService],
})
export class SampleModule {}
