import { Types } from 'mongoose';

import { UserDocument } from '@users/models/user.schema';

export const mockUserListDocument: UserDocument[] = [
  {
    _id: new Types.ObjectId('66029b303931e561b89eaff5'),
    email: 'tester1@sample.com',
    password: '$2a$10$zkqO3YE7uyijTo6yDl3deOfDZE0BgKUk7ThnNL6nVVMGe3gB3c/L2',
    role: 'admin',
  },
  {
    _id: new Types.ObjectId('66029fc4ce1fa5f8bedefb85'),
    email: 'tester2@sample.com',
    password: '$2a$10$WQY6beLgtnXrpvC7Z/zqiOsrq8eygsqUWmhw7L6PjcG.o5Y3kM/Uq',
    role: 'student',
  },
];
