import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-champagne flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-soft-white rounded-sm shadow-sm p-8 border border-rose-gold/20 flex flex-col items-center">
        <div className="text-center mb-8 w-full">
          <h2 className="font-display text-4xl text-deep-brown mb-2">Reset Password</h2>
          <p className="font-body text-deep-brown/60 text-sm tracking-wider uppercase">
            Enter your email to receive a reset link
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-50 text-red-600 p-3 mb-6 text-sm rounded-sm text-center border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="w-full bg-green-50 text-green-600 p-3 mb-6 text-sm rounded-sm text-center border border-green-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="block text-xs font-body tracking-wider uppercase text-deep-brown/80 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-transparent border border-rose-gold/30 p-3 focus:outline-none focus:border-rose-gold transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-8 text-center w-full pt-6 border-t border-rose-gold/20">
          <Link to="/login" className="text-xs font-body text-deep-brown/60 hover:text-rose-gold transition-colors uppercase tracking-wider inline-flex items-center">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
