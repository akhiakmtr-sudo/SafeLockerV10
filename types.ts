
export type Page = 'landing' | 'login' | 'signup' | 'forgotPassword' | 'dashboard';

export interface User {
  username: string;
  attributes: {
    name: string;
    email: string;
  };
}

export interface FileItem {
  key: string;
  lastModified: Date;
  size: number;
}

export type FolderType = 'Photos' | 'Videos' | 'Documents';
   