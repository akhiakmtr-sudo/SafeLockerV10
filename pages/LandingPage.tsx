
import React from 'react';
import { Page } from '../types';

interface LandingPageProps {
  navigateTo: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigateTo }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
          Safe Locker
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Your personal and secure digital vault.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigateTo('login')}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigateTo('signup')}
            className="px-8 py-3 bg-gray-100 text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
   