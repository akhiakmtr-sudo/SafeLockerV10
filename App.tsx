
import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import { Page, User } from './types';
import { Auth } from './services/amplifyService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await Auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('landing');
      }
    } catch (error) {
      console.error('No current user', error);
      setCurrentPage('landing');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleSignOut = async () => {
    await Auth.signOut();
    setUser(null);
    navigateTo('landing');
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage navigateTo={navigateTo} onLoginSuccess={setUser} />;
      case 'signup':
        return <SignupPage navigateTo={navigateTo} onSignupSuccess={setUser} />;
      case 'forgotPassword':
        return <ForgotPasswordPage navigateTo={navigateTo} />;
      case 'dashboard':
        return user ? <DashboardPage user={user} onSignOut={handleSignOut} /> : <LoginPage navigateTo={navigateTo} onLoginSuccess={setUser} />;
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
   