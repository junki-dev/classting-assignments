import { PartialType } from '@nestjs/swagger';

import { FeedDocument } from '@schools/models/feed.schema';

export class UpdateFeedDto extends PartialType(FeedDocument) {}
