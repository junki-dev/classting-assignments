import { PickType } from '@nestjs/swagger';

import { UserDocument } from '@users/models/user.schema';

export class SignUpDto extends PickType(UserDocument, ['email', 'password', 'role']) {}
