export const PERMISSIONS = {
  // Thực thể Group
  GROUP_C: 'GROUP_C',
  GROUP_R: 'GROUP_R',
  GROUP_U: 'GROUP_U',
  GROUP_D: 'GROUP_D',
  GROUP_ADD_USER: 'GROUP_ADD_USER',
  GROUP_DELETE_USER: 'GROUP_DELETE_USER',

  // Thực thể User
  USER_C: 'USER_C',
  USER_R: 'USER_R',
  USER_U: 'USER_U',
  USER_D: 'USER_D',

  // Thực thể Chat & Conversation
  CHAT: 'CHAT',
  CONV_C: 'CONV_C',
  CONV_R: 'CONV_R',
  CONV_U: 'CONV_U',
  CONV_D: 'CONV_D',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;