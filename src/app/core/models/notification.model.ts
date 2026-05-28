export type NotificationKind = 'lesson' | 'quiz' | 'system';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  route?: string;
  at: number;
  readAt?: number;
};
