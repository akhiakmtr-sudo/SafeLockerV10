

import { MediaItem, User } from '../types';

// --- MOCK DATA ---
const MOCK_USER: User = {
  username: 'testuser',
  // FIX: Added missing userId property to conform to the User type.
  userId: 'mock-user-id',
  attributes: {
    name: 'Test User',
    email: 'test@example.com',
  },
};

// FIX: Replaced FileItem with MediaItem and updated data structure to match.
let MOCK_DB: { [key: string]: MediaItem[] } = {
  'photos/': [
    { id: 'mock1', owner: 'testuser', filename: 'vacation.jpg', key: 'photos/vacation.jpg', fileType: 'image/jpeg', folder: 'photos', createdAt: new Date('2023-10-26').toISOString(), size: 2048000 },
    { id: 'mock2', owner: 'testuser', filename: 'family.png', key: 'photos/family.png', fileType: 'image/png', folder: 'photos', createdAt: new Date('2023-09-15').toISOString(), size: 5120000 },
  ],
  'videos/': [
    { id: 'mock3', owner: 'testuser', filename: 'birthday.mp4', key: 'videos/birthday.mp4', fileType: 'video/mp4', folder: 'videos', createdAt: new Date('2023-11-01').toISOString(), size: 150000000 },
  ],
  'documents/': [
    { id: 'mock4', owner: 'testuser', filename: 'resume.pdf', key: 'documents/resume.pdf', fileType: 'application/pdf', folder: 'documents', createdAt: new Date('2023-08-05').toISOString(), size: 150000 },
    { id: 'mock5', owner: 'testuser', filename: 'project-plan.docx', key: 'documents/project-plan.docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', folder: 'documents', createdAt: new Date('2023-10-20').toISOString(), size: 750000 },
  ],
};

let IS_LOGGED_IN = false;

// --- MOCK Amplify Auth ---
export const Auth = {
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (IS_LOGGED_IN) {
          resolve(MOCK_USER);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  async signIn(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'Password123!') {
          IS_LOGGED_IN = true;
          resolve(MOCK_USER);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  async signUp(data: { name: string; email: string; password: string }): Promise<{ user: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Signing up user:', data.email);
        resolve({ user: { username: data.email } });
      }, 1000);
    });
  },

  async confirmSignUp(email: string, code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code === '123456') {
          console.log('Confirmed sign up for:', email);
          IS_LOGGED_IN = true;
          resolve('SUCCESS');
        } else {
          reject(new Error('Invalid OTP'));
        }
      }, 1000);
    });
  },
  
  async forgotPassword(email: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Forgot password for:', email);
            resolve('SUCCESS');
        }, 1000);
    });
  },

  async forgotPasswordSubmit(email: string, code: string, newPassword: string): Promise<string> {
     return new Promise((resolve, reject) => {
         setTimeout(() => {
             if (code === '123456') {
                 console.log('Password reset for:', email);
                 resolve('SUCCESS');
             } else {
                 reject(new Error('Invalid OTP'));
             }
         }, 1000);
     });
  },

  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        IS_LOGGED_IN = false;
        resolve();
      }, 500);
    });
  },
};

// --- MOCK Amplify Storage ---
export const Storage = {
  // FIX: Changed return type from FileItem[] to MediaItem[].
  async list(path: 'photos/' | 'videos/' | 'documents/'): Promise<MediaItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DB[path] || []);
      }, 1000);
    });
  },
  
  async put(key: string, file: File, options: { progressCallback?: (progress: { loaded: number; total: number }) => void }): Promise<{ key: string }> {
    return new Promise((resolve) => {
      let loaded = 0;
      const total = file.size;
      const interval = setInterval(() => {
        loaded += total / 10;
        if (options.progressCallback) {
          options.progressCallback({ loaded, total });
        }
        if (loaded >= total) {
          clearInterval(interval);
          // FIX: Created a new MediaItem object to conform to the type.
          const folderName = key.split('/')[0];
          const newFile: MediaItem = {
            id: `mock-${Date.now()}`,
            key,
            size: file.size,
            createdAt: new Date().toISOString(),
            filename: file.name,
            fileType: file.type,
            folder: folderName,
            owner: MOCK_USER.username,
          };
          const folderPath = folderName + '/';
          if (MOCK_DB[folderPath]) {
            MOCK_DB[folderPath].push(newFile);
          } else {
            MOCK_DB[folderPath] = [newFile];
          }
          resolve({ key });
        }
      }, 100);
    });
  },
  
  async remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const folder = key.split('/')[0] + '/';
        if (MOCK_DB[folder]) {
          MOCK_DB[folder] = MOCK_DB[folder].filter(file => file.key !== key);
        }
        resolve();
      }, 500);
    });
  },
};