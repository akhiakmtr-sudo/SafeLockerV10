import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getCurrentUser, fetchUserAttributes, signIn, signOut, signUp, confirmSignUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: typeof signIn;
  signUp: typeof signUp;
  confirmSignUp: typeof confirmSignUp;
  signOut: typeof signOut;
  resetPassword: typeof resetPassword;
  confirmResetPassword: typeof confirmResetPassword;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUser({
        username: authUser.username,
        userId: authUser.userId,
        attributes: {
          name: attributes.name || '',
          email: attributes.email || '',
        },
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'autoSignIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
      }
    });

    checkUser();

    return () => unsubscribe();
  }, [checkUser]);

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    resetPassword,
    confirmResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
