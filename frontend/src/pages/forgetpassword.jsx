import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(response.data.message); // Show the success message from the backend
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
            <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
            <p className="text-sm text-gray-300 mt-1">Enter your email to receive a reset link.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400" /></div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/10 rounded-2xl placeholder-gray-400 text-white" 
                placeholder="Your registered email"
              />
            </div>
            
            {message && <p className="text-sm text-green-400 text-center">{message}</p>}
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-2xl font-semibold shadow-lg disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;