import { Module } from '@nestjs/common';

import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

import { DatabaseModule } from '@common/database/database.module';
import { SchoolDocument, SchoolSchema } from '@schools/models/school.schema';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([{ name: SchoolDocument.name, schema: SchoolSchema }])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
