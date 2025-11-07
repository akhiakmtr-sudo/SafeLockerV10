
import { FileItem, User } from '../types';

// --- MOCK DATA ---
const MOCK_USER: User = {
  username: 'testuser',
  attributes: {
    name: 'Test User',
    email: 'test@example.com',
  },
};

let MOCK_DB: { [key: string]: FileItem[] } = {
  'photos/': [
    { key: 'photos/vacation.jpg', lastModified: new Date('2023-10-26'), size: 2048000 },
    { key: 'photos/family.png', lastModified: new Date('2023-09-15'), size: 5120000 },
  ],
  'videos/': [
    { key: 'videos/birthday.mp4', lastModified: new Date('2023-11-01'), size: 150000000 },
  ],
  'documents/': [
    { key: 'documents/resume.pdf', lastModified: new Date('2023-08-05'), size: 150000 },
    { key: 'documents/project-plan.docx', lastModified: new Date('2023-10-20'), size: 750000 },
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
  async list(path: 'photos/' | 'videos/' | 'documents/'): Promise<FileItem[]> {
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
          const newFile: FileItem = { key, size: file.size, lastModified: new Date() };
          const folder = key.split('/')[0] + '/';
          if (MOCK_DB[folder]) {
            MOCK_DB[folder].push(newFile);
          } else {
            MOCK_DB[folder] = [newFile];
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
   