export const NODE_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
} as const;

export const EMPTY_STATE_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
  GENERAL: 'general',
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];
export type EmptyStateType = (typeof EMPTY_STATE_TYPES)[keyof typeof EMPTY_STATE_TYPES];
