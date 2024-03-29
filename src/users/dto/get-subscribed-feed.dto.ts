import { FeedDto } from '@common/dto/feed.dto';
import { GetSubscribedSchoolDto } from '@users/dto/get-subscribed-school.dto';

export class GetSubscribedFeedDto extends GetSubscribedSchoolDto {
  feedList: FeedDto[];
}
