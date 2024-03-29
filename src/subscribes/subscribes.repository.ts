import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AbstractRepository } from '@common/database/abstract.repository';
import { FeedDocument } from '@schools/models/feed.schema';
import { SubscribeDocument } from '@src/subscribes/models/subscribe.schema';
import { AggregateFeedBySchoolDto } from '@subscribes/dto/aggregate-feed-by-school.dto';
import { entityToDto } from '@utils/converter.utils';

@Injectable()
export class SubscribesRepository extends AbstractRepository<SubscribeDocument> {
  protected readonly logger = new Logger(SubscribesRepository.name);

  constructor(@InjectModel(SubscribeDocument.name) subscribeModel: Model<SubscribeDocument>) {
    super(subscribeModel);
  }

  /**
   * get subscribed document by user id and school id
   * @param {string} userId                user id
   * @param {string} schoolId              school id
   * @returns {Promise<SubscribeDocument>} subscribe document
   */
  async getSubscribedFeedsGroupBySchoolId(userId: string, schoolId: string): Promise<SubscribeDocument> {
    return this.aggregate([
      {
        $match: { $and: [{ user: new Types.ObjectId(userId) }, { isDeleted: false }] },
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'school',
          foreignField: '_id',
          as: 'school',
        },
      },
      {
        $unwind: '$school',
      },
      {
        $match: { 'school._id': new Types.ObjectId(schoolId) },
      },
      {
        $lookup: {
          from: 'feeds',
          let: { feedList: '$school.feedList' },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $in: ['$_id', '$$feedList'],
                    },
                  },
                  {
                    isDeleted: false,
                  },
                ],
              },
            },
          ],
          as: 'school.feeds',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]).then((subscribeDocumentList: Array<SubscribeDocument & { school: { feeds: FeedDocument[] } }>) => {
      const subscribeDocument = subscribeDocumentList.shift();
      if (!(subscribeDocument && subscribeDocument.school)) {
        return null;
      }

      subscribeDocument.school.feedList = subscribeDocument.school.feeds;

      return subscribeDocument;
    });
  }

  /**
   * get subscribed feed list by user id
   * @param {string} userId                         user id
   * @returns {Promise<AggregateFeedBySchoolDto[]>} subscribed feed list
   */
  async getSubscribedFeedsGroupBySchool(userId: string): Promise<AggregateFeedBySchoolDto[]> {
    return this.aggregate([
      {
        $match: { user: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'school',
          foreignField: '_id',
          as: 'school',
        },
      },
      {
        $unwind: '$school',
      },
      {
        $lookup: {
          from: 'feeds',
          let: {
            feedList: '$school.feedList',
            schoolId: '$school._id',
            schoolName: '$school.name',
            schoolLocation: '$school.location',
            subscribeCreatedAt: '$createdAt',
            subscribeUpdatedAt: '$updatedAt',
            subscribeIsDeleted: '$isDeleted',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $in: ['$_id', '$$feedList'] },
                        { isDeleted: false },
                        { $eq: ['$$subscribeIsDeleted', true] }, // 현재 구독 취소 상태라면,
                        { $gte: ['$createdAt', '$$subscribeCreatedAt'] }, // 구독한 날 이후,
                        { $lte: ['$createdAt', '$$subscribeUpdatedAt'] }, // 구독 취소 전의 feed 목록을 가져온다.
                      ],
                    },
                    {
                      $and: [
                        { $in: ['$_id', '$$feedList'] },
                        { isDeleted: false },
                        { $eq: ['$$subscribeIsDeleted', false] }, // 현재 구독 상태라면,
                        { $gt: ['$createdAt', '$$subscribeCreatedAt'] }, // 구독한 날 이후 feed 목록을 가져온다.
                      ],
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                school: {
                  _id: '$$schoolId',
                  name: '$$schoolName',
                  location: '$$schoolLocation',
                },
              },
            },
          ],
          as: 'feeds',
        },
      },
      {
        $unwind: '$feeds',
      },
      {
        $replaceRoot: { newRoot: '$feeds' },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]).then((aggregateFeedBySchoolDtoList: AggregateFeedBySchoolDto[]) => {
      return aggregateFeedBySchoolDtoList.map((aggregateFeedBySchoolDto) => {
        return {
          ...entityToDto(AggregateFeedBySchoolDto, aggregateFeedBySchoolDto),
          school: aggregateFeedBySchoolDto.school,
        };
      });
    });
  }
}
