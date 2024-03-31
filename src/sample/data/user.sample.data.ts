import { UserDocument } from '@users/models/user.schema';

export const userSampleData: Array<Omit<Partial<UserDocument>, '_id'>> = [
  {
    email: 'sample01@sample.com',
    password: 'StrongPwd!1',
    role: 'admin',
  },
  {
    email: 'sample02@sample.com',
    password: 'StrongPwd!1',
    role: 'student',
  },
];
