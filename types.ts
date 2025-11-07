export type Page = 'landing' | 'login' | 'signup' | 'forgotPassword' | 'dashboard';

export interface User {
  username: string;
  userId: string;
  attributes: {
    name: string;
    email: string;
  };
}

export interface MediaItem {
  id: string;
  owner?: string | null;
  filename: string;
  key: string;
  fileType: string;
  folder: string;
  createdAt: string; // This is an AWSDateTime string
  size: number;
}

export type FolderType = 'Photos' | 'Videos' | 'Documents';
