import { Module } from '@nestjs/common';

import { SubscribeDocument, SubscribeSchema } from './models/subscribe.schema';
import { SubscribesRepository } from './subscribes.repository';
import { SubscribesService } from './subscribes.service';

import { DatabaseModule } from '@common/database/database.module';
import { SchoolsModule } from '@schools/schools.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: SubscribeDocument.name, schema: SubscribeSchema }]),
    SchoolsModule,
  ],
  providers: [SubscribesService, SubscribesRepository],
  exports: [SubscribesService],
})
export class SubscribesModule {}
