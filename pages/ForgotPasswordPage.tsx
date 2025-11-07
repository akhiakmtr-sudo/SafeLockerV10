
import React, { useState } from 'react';
import { Page } from '../types';
import { Auth } from '../services/amplifyService';

interface ForgotPasswordPageProps {
  navigateTo: (page: Page) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigateTo }) => {
  const [step, setStep] = useState<'sendCode' | 'reset'>('sendCode');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validatePassword = (pw: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pw);
  };
  
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await Auth.forgotPassword(email);
      setMessage('A verification code has been sent to your email.');
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to send code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(newPassword)) {
        setError('Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, a number, and a symbol.');
        return;
    }

    setLoading(true);
    try {
      await Auth.forgotPasswordSubmit(email, otp, newPassword);
      setMessage('Password reset successfully! You can now log in.');
      setTimeout(() => navigateTo('login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Invalid code?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Reset Password</h2>
        {step === 'sendCode' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Verification Code</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
               <p className="mt-2 text-xs text-gray-500">Min 8 chars, with uppercase, lowercase, number, and symbol.</p>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        {message && <p className="text-sm text-green-600 mt-4">{message}</p>}
        <button onClick={() => navigateTo('login')} className="w-full mt-4 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
   