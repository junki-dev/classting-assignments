import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractRepository } from '@common/database/abstract.repository';
import { FeedDocument } from '@schools/models/feed.schema';

@Injectable()
export class FeedsRepository extends AbstractRepository<FeedDocument> {
  protected readonly logger = new Logger(FeedsRepository.name);

  constructor(@InjectModel(FeedDocument.name) feedModel: Model<FeedDocument>) {
    super(feedModel);
  }
}
