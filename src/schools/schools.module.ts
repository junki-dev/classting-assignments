import { Module } from '@nestjs/common';

import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

import { DatabaseModule } from '@common/database/database.module';
import { FeedDocument, FeedSchema } from '@schools/models/feed.schema';
import { SchoolDocument, SchoolSchema } from '@schools/models/school.schema';
import { FeedsRepository } from '@schools/repositories/feeds.repository';
import { SchoolsRepository } from '@schools/repositories/schools.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: SchoolDocument.name, schema: SchoolSchema },
      { name: FeedDocument.name, schema: FeedSchema },
    ]),
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService, SchoolsRepository, FeedsRepository],
  exports: [SchoolsRepository, FeedsRepository],
})
export class SchoolsModule {}
