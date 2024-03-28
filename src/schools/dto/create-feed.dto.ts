import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

import { FeedDocument } from '@schools/models/feed.schema';

export class CreateFeedDto extends PartialType(PickType(FeedDocument, ['content', 'adminId'] as const)) {
  @ApiProperty({ description: 'school id' })
  @IsMongoId()
  schoolId: string;
}
