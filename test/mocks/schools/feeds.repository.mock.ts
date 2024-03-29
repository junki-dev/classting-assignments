import * as moment from 'moment';
import { Types } from 'mongoose';

import { FeedDocument } from '@schools/models/feed.schema';

export const mockSchool1FeedDocumentList1: FeedDocument[] = [
  {
    _id: new Types.ObjectId('6603e8e2ad74c24305aa42da'),
    content: 'test 1 school one content 1',
    adminId: new Types.ObjectId('6603e88fad74c24305aa42ca'),
    isDeleted: false,
    createdAt: moment().startOf('m').subtract(1, 'h').toDate(),
    updatedAt: moment().startOf('m').subtract(1, 'h').toDate(),
  },
  {
    _id: new Types.ObjectId('6604a0f786d550c1417552d3'),
    content: 'test 1 school one content 2',
    adminId: new Types.ObjectId('6603e88fad74c24305aa42ca'),
    isDeleted: false,
    createdAt: moment().startOf('m').subtract(1, 'h').toDate(),
    updatedAt: moment().startOf('m').subtract(1, 'h').toDate(),
  },
];

export const mockSchool1FeedDocumentList2: FeedDocument[] = [
  {
    _id: new Types.ObjectId('6603e8e2ad74c24305aa42da'),
    content: 'test 2 school one content 1',
    adminId: new Types.ObjectId('6603e88fad74c24305aa42ca'),
    isDeleted: false,
    createdAt: moment().startOf('m').subtract(1, 'h').toDate(),
    updatedAt: moment().startOf('m').subtract(1, 'h').toDate(),
  },
  {
    _id: new Types.ObjectId('6604a0f786d550c1417552d3'),
    content: 'test 2 school one content 2',
    adminId: new Types.ObjectId('6603e88fad74c24305aa42ca'),
    isDeleted: false,
    createdAt: moment().startOf('m').subtract(1, 'h').toDate(),
    updatedAt: moment().startOf('m').subtract(1, 'h').toDate(),
  },
];
