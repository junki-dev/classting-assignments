import * as moment from 'moment/moment';
import { Types } from 'mongoose';

import { mockSchool1FeedDocumentList1 } from '../schools/feeds.repository.mock';
import { mockSchoolDocumentList } from '../schools/schools.repository.mock';
import { mockUserListDocument } from '../users/users.repository.mock';

import { AggregateFeedBySchoolDto } from '@subscribes/dto/aggregate-feed-by-school.dto';
import { SubscribeDocument } from '@subscribes/models/subscribe.schema';

export const mockSubscribesFeedList: SubscribeDocument[] = [
  {
    _id: new Types.ObjectId('660533898d1217b2da9e7dac'),
    user: mockUserListDocument[0],
    isDeleted: false,
    createdAt: moment().startOf('m').subtract(1, 'h').toDate(),
    updatedAt: moment().startOf('m').subtract(1, 'h').toDate(),
    school: mockSchoolDocumentList[0],
  },

  {
    _id: new Types.ObjectId('660533968d1217b2da9e7db8'),
    user: mockUserListDocument[0],
    isDeleted: false,
    createdAt: moment().startOf('m').subtract(0.5, 'h').toDate(),
    updatedAt: moment().startOf('m').subtract(0.5, 'h').toDate(),
    school: mockSchoolDocumentList[1],
  },
];

export const mockAggregateFeedList1: AggregateFeedBySchoolDto[] = [
  {
    _id: mockSchool1FeedDocumentList1[0]._id,
    content: mockSchool1FeedDocumentList1[0].content,
    adminId: mockSchool1FeedDocumentList1[0].adminId,
    createdAt: mockSchool1FeedDocumentList1[0].createdAt,
    school: {
      _id: mockSchoolDocumentList[0]._id,
      name: mockSchoolDocumentList[0].name,
      location: mockSchoolDocumentList[0].location,
    },
  },
];

export const mockAggregateFeedList2: AggregateFeedBySchoolDto[] = [
  {
    _id: mockSchool1FeedDocumentList1[1]._id,
    content: mockSchool1FeedDocumentList1[1].content,
    adminId: mockSchool1FeedDocumentList1[1].adminId,
    createdAt: mockSchool1FeedDocumentList1[1].createdAt,
    school: {
      _id: mockSchoolDocumentList[1]._id,
      name: mockSchoolDocumentList[1].name,
      location: mockSchoolDocumentList[1].location,
    },
  },
];
