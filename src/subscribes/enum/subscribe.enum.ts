export const SubscribeEnum = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
} as const;

export type SubscribeEnumType = (typeof SubscribeEnum)[keyof typeof SubscribeEnum];
