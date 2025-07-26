import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Gets token from URL: ?token=...

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If no token is found in the URL, don't show the form.
  if (!token) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">Invalid Link</h2>
            <p className="mt-2">No password reset token was found. Please request a new link.</p>
            <Link to="/forgot-password" className="mt-4 text-blue-400 hover:underline">Request a new link</Link>
        </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token: token,
        newPassword: password
      });
      setMessage(response.data.message);
    } catch (err) {
      const serverError = err.response?.data?.message || 'An unexpected error occurred.';
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Set New Password</h2>
            <p className="text-sm text-gray-300 mt-1">Please choose a new password for your account.</p>
          </div>
          
          {message ? (
            <div className="text-center">
              <p className="text-lg text-green-400">{message}</p>
              <Link to="/login" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-xl">Go to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-gray-400" /></div>
                <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/10 rounded-2xl placeholder-gray-400 text-white" placeholder="New password" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-gray-400" /></div>
                <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/10 rounded-2xl placeholder-gray-400 text-white" placeholder="Confirm new password" />
              </div>
              
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-2xl font-semibold shadow-lg disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;