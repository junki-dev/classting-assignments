export const RoleEnum = {
  Admin: 'admin',
  Student: 'student',
} as const;

export type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum];
