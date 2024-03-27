import { SetMetadata } from '@nestjs/common';

import { RoleEnumType } from '@auth/enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnumType[]) => SetMetadata(ROLES_KEY, roles);
