import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import { FeedDto } from '@common/dto/feed.dto';
import { SubscribesService } from '@src/subscribes/subscribes.service';
import { AggregateFeedBySchoolDto } from '@subscribes/dto/aggregate-feed-by-school.dto';
import { SubscribeEnum } from '@subscribes/enum/subscribe.enum';
import { GetSubscribedFeedDto } from '@users/dto/get-subscribed-feed.dto';
import { GetSubscribedSchoolDto } from '@users/dto/get-subscribed-school.dto';
import { GetUserDto } from '@users/dto/get-user.dto';
import { UserDocument } from '@users/models/user.schema';
import { UsersRepository } from '@users/users.repository';
import { entityToDto, entityToDtoArray } from '@utils/converter.utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly subscribesService: SubscribesService,

    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * get subscribed school page list
   * @param {string} _id                     user id
   * @returns {Promise<SubscribeDocument[]>} subscribe document list
   */
  async getSubscribedSchool(_id: string): Promise<GetSubscribedSchoolDto[]> {
    const user = await this.usersRepository.findOne(
      { _id },
      { path: 'subscribeList', match: { isDeleted: false }, populate: { path: 'school' } },
    );
    if (!(user.subscribeList && user.subscribeList.length)) {
      return [];
    }

    return entityToDtoArray(
      GetSubscribedSchoolDto,
      user.subscribeList.map((subscription) => subscription.school),
    );
  }

  /**
   * get subscribed feed
   * @param {string} _id                        user id
   * @returns {Promise<GetSubscribedFeedDto[]>} subscribed feed list
   */
  async getSubscribedFeedBySchool(_id: string): Promise<AggregateFeedBySchoolDto[]> {
    return this.subscribesService.getSubscribedFeedsBySchool(_id);
  }

  /**
   * get subscribed feed by school id
   * @param {string} _id                      user id
   * @param {string} schoolId                 school id
   * @returns {Promise<GetSubscribedFeedDto>} subscribed feed
   */
  async getSubscribedFeedBySchoolId(_id: string, schoolId: string): Promise<GetSubscribedFeedDto> {
    const subscribedDocumentDto = await this.subscribesService.getSubscribedFeedsBySchoolId(_id, schoolId);
    if (!subscribedDocumentDto) {
      this.logger.error(`the school is not subscribed, user_id=${_id} school_id=${schoolId}`);
      throw new ForbiddenException(`the school is not subscribed, user_id=${_id} school_id=${schoolId}`);
    }

    return {
      ...entityToDto(GetSubscribedFeedDto, subscribedDocumentDto.school),
      feedList: entityToDtoArray(FeedDto, subscribedDocumentDto.school.feedList),
    };
  }

  /**
   * subscribe school page
   * @param {string} _id      user id
   * @param {string} schoolId school id
   * @returns {Promise<void>}
   */
  async subscribeSchoolPage(_id: string, schoolId: string): Promise<void> {
    const user = await this.usersRepository.findOne({ _id });
    const subscribeDocument = await this.subscribesService.subscribeSchool(user, schoolId, SubscribeEnum.SUBSCRIBE);

    await this.usersRepository.findOneAndUpdate({ _id }, { $push: { subscribeList: subscribeDocument._id } });
  }

  /**
   * unsubscribe school page
   * @param {string} _id      user id
   * @param {string} schoolId school id
   * @returns {Promise<void>}
   */
  async unsubscribeSchoolPage(_id: string, schoolId: string): Promise<void> {
    const user = await this.usersRepository.findOne({ _id });
    await this.subscribesService.subscribeSchool(user, schoolId, SubscribeEnum.UNSUBSCRIBE);
  }

  /**
   * get user document
   * @param {GetUserDto} getUserDto   get user dto
   * @returns {Promise<UserDocument>} user document
   */
  async getUser(getUserDto: GetUserDto): Promise<UserDocument> {
    return this.usersRepository.findOne(getUserDto);
  }
}
