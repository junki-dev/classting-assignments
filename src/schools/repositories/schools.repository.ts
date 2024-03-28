import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from '@common/database/abstract.repository';
import { SchoolDocument } from '@schools/models/school.schema';

@Injectable()
export class SchoolsRepository extends AbstractRepository<SchoolDocument> {
  protected readonly logger = new Logger(SchoolsRepository.name);

  constructor(@InjectModel(SchoolDocument.name) schoolModel: Model<SchoolDocument>) {
    super(schoolModel);
  }
}
