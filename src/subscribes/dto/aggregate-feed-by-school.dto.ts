import { FeedDto } from '@common/dto/feed.dto';
import { SchoolDocument } from '@schools/models/school.schema';

export class AggregateFeedBySchoolDto extends FeedDto {
  school: Pick<SchoolDocument, '_id' | 'name' | 'location'>;
}
