import * as moment from 'moment';
import { Types } from 'mongoose';

import { mockSchool1FeedDocumentList1, mockSchool1FeedDocumentList2 } from './feeds.repository.mock';

import { SchoolDocument } from '@schools/models/school.schema';

export const mockSchoolDocumentList: SchoolDocument[] = [
  {
    _id: new Types.ObjectId('6603e8a6ad74c24305aa42d5'),
    name: 'test school one',
    location: 'seoul',
    adminId: new Types.ObjectId('6603e88fad74c24305aa42ca'),
    feedList: mockSchool1FeedDocumentList1,
    createdAt: moment().startOf('m').subtract(2, 'h').toDate(),
  },
  {
    _id: new Types.ObjectId('6603e8a6ad74c24305aa42d5'),
    name: 'test school two',
    location: 'busan',
    adminId: new Types.ObjectId('6603e88fad74c24305aa42ca'),
    feedList: mockSchool1FeedDocumentList2,
    createdAt: moment().startOf('m').subtract(2, 'h').toDate(),
  },
];
