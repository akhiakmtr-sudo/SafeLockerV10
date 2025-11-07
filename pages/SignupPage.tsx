
import React, { useState } from 'react';
import { Page, User } from '../types';
import { Auth } from '../services/amplifyService';

interface SignupPageProps {
  navigateTo: (page: Page) => void;
  onSignupSuccess: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ navigateTo, onSignupSuccess }) => {
  const [step, setStep] = useState<'signup' | 'confirm'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pw);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, a number, and a symbol.');
      return;
    }
    
    setLoading(true);
    try {
      await Auth.signUp({ name, email, password });
      setStep('confirm');
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await Auth.confirmSignUp(email, otp);
      const user = await Auth.signIn(email, password);
      onSignupSuccess(user);
      navigateTo('dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        {step === 'signup' ? (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                <p className="mt-2 text-xs text-gray-500">Min 8 chars, with uppercase, lowercase, number, and symbol.</p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800">Verify Email</h2>
            <p className="text-center text-gray-600">An OTP has been sent to {email}.</p>
            <form onSubmit={handleConfirm} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Verification Code</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                {loading ? 'Verifying...' : 'Verify & Sign Up'}
              </button>
            </form>
          </>
        )}
        <button onClick={() => navigateTo('landing')} className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
   