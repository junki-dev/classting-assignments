import { RoleEnumType } from '@auth/enum/role.enum';

export interface TokenPayload {
  userId: string;
  role: RoleEnumType;
}
