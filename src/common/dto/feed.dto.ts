import { PartialType, PickType } from '@nestjs/swagger';

import { FeedDocument } from '@schools/models/feed.schema';

export class FeedDto extends PartialType(PickType(FeedDocument, ['_id', 'content', 'adminId', 'createdAt'] as const)) {}
