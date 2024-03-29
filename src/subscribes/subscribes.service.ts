import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { SubscribeDocument } from './models/subscribe.schema';
import { SubscribesRepository } from './subscribes.repository';

import { SchoolsRepository } from '@schools/repositories/schools.repository';
import { AggregateFeedBySchoolDto } from '@subscribes/dto/aggregate-feed-by-school.dto';
import { SubscribeEnum, SubscribeEnumType } from '@subscribes/enum/subscribe.enum';
import { UserDocument } from '@users/models/user.schema';

@Injectable()
export class SubscribesService {
  private readonly logger = new Logger(SubscribesService.name);

  constructor(
    private readonly subscribesRepository: SubscribesRepository,
    private readonly schoolsRepository: SchoolsRepository,
  ) {}

  /**
   * subscribe/unsubscribe school
   * @param {UserDocument} user               user document
   * @param {string} schoolId                 school id
   * @param {SubscribeEnumType} subscribeType subscribe enum type
   * @returns {Promise<SubscribeDocument>}    subscribe document
   */
  async subscribeSchool(
    user: UserDocument,
    schoolId: string,
    subscribeType: SubscribeEnumType,
  ): Promise<SubscribeDocument> {
    const school = await this.schoolsRepository.findOne(new Types.ObjectId(schoolId));
    if (!school) {
      this.logger.error(`not found school, user_id=${user._id} school_id=${schoolId} subscribe_state=${subscribeType}`);
      throw new NotFoundException(
        `not found school id, user_id=${user._id} school_id=${schoolId} subscribe_state=${subscribeType}`,
      );
    }

    if (subscribeType === SubscribeEnum.SUBSCRIBE) {
      const subscribes = await this.subscribesRepository.findOne({
        user,
        school,
        isDeleted: false,
      });
      if (subscribes) {
        this.logger.error(
          `already subscribed school, user_id=${user._id} school_id=${schoolId} subscribe_state=${subscribeType}`,
        );
        throw new ConflictException(
          `already subscribed school, user_id=${user._id} school_id=${schoolId} subscribe_state=${subscribeType}`,
        );
      }

      // if subscribe_state, should insert subscription info
      return this.subscribesRepository.create({
        user,
        school,
      });
    } else if (subscribeType === SubscribeEnum.UNSUBSCRIBE) {
      // if unsubscribe_state, should update isDelete state true
      await this.subscribesRepository.findOneAndUpdate(
        { user, school },
        {
          isDeleted: true,
          updatedAt: new Date(),
        },
      );
    }
  }

  /**
   * get subscribed feed
   * @param {string} userId                         user id
   * @returns {Promise<AggregateFeedBySchoolDto[]>} subscribed feed list
   */
  async getSubscribedFeedsBySchool(userId: string): Promise<AggregateFeedBySchoolDto[]> {
    return this.subscribesRepository.getSubscribedFeedsGroupBySchool(userId);
  }

  /**
   * get subscribed feed by school id
   * @param {string} userId                   user id
   * @param {string} schoolId                 school id
   * @returns {Promise<GetSubscribedFeedDto>} subscribed feed
   */
  async getSubscribedFeedsBySchoolId(userId: string, schoolId: string): Promise<SubscribeDocument> {
    return this.subscribesRepository.getSubscribedFeedsGroupBySchoolId(userId, schoolId);
  }
}
