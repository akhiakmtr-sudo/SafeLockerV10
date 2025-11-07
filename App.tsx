import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import { Page } from './types';
import { useAuth } from './auth/useAuth';

const App: React.FC = () => {
  const { user, isLoading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setCurrentPage('dashboard');
      } else {
        // Stay on auth pages if already there, otherwise go to landing
        if (currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'forgotPassword') {
            setCurrentPage('landing');
        }
      }
    }
  }, [user, isLoading, currentPage]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    if (user) {
        return <DashboardPage user={user} onSignOut={signOut} />;
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'signup':
        return <SignupPage navigateTo={navigateTo} />;
      case 'forgotPassword':
        return <ForgotPasswordPage navigateTo={navigateTo} />;
      case 'landing':
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };

  return (
     <div className="w-screen min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 font-sans">
        {renderPage()}
     </div>
  );
};

export default App;
