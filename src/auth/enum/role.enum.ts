export const RoleEnum = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum];
