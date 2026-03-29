import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const { user, loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/cart');
      }
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingAction(true);

    try {
      if (isSignIn) {
        await loginWithEmail(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await registerWithEmail(email, password, displayName);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoadingAction(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-champagne flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-soft-white rounded-sm shadow-sm p-8 border border-rose-gold/20 flex flex-col items-center">
        <div className="text-center mb-8 w-full">
          <h2 className="font-display text-4xl text-deep-brown mb-2">Welcome</h2>
          <p className="font-body text-deep-brown/60 text-sm tracking-wider uppercase">
            {isSignIn ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="flex mb-8 w-full">
          <button
            className={`flex-1 pb-3 text-sm font-body uppercase tracking-wider transition-colors ${isSignIn ? 'border-b-2 border-rose-gold text-rose-gold font-medium' : 'border-b-2 border-transparent text-deep-brown/60 hover:text-deep-brown'}`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 pb-3 text-sm font-body uppercase tracking-wider transition-colors ${!isSignIn ? 'border-b-2 border-rose-gold text-rose-gold font-medium' : 'border-b-2 border-transparent text-deep-brown/60 hover:text-deep-brown'}`}
            onClick={() => setIsSignIn(false)}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="w-full bg-red-50 text-red-600 p-3 mb-6 text-sm rounded-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {!isSignIn && (
            <div>
              <label className="block text-xs font-body tracking-wider uppercase text-deep-brown/80 mb-1">Display Name</label>
              <input
                type="text"
                required
                className="w-full bg-transparent border border-rose-gold/30 p-3 focus:outline-none focus:border-rose-gold transition-colors"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-body tracking-wider uppercase text-deep-brown/80 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-transparent border border-rose-gold/30 p-3 focus:outline-none focus:border-rose-gold transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-body tracking-wider uppercase text-deep-brown/80 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-transparent border border-rose-gold/30 p-3 focus:outline-none focus:border-rose-gold transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isSignIn && (
            <div>
              <label className="block text-xs font-body tracking-wider uppercase text-deep-brown/80 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full bg-transparent border border-rose-gold/30 p-3 focus:outline-none focus:border-rose-gold transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loadingAction}
            className="w-full btn-primary py-4 disabled:opacity-50"
          >
            {loadingAction ? 'Processing...' : (isSignIn ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center w-full">
          <div className="border-t border-rose-gold/20 flex-1"></div>
          <span className="px-4 text-xs font-body text-deep-brown/40 uppercase tracking-widest">or</span>
          <div className="border-t border-rose-gold/20 flex-1"></div>
        </div>

        <div className="mt-6 w-full">
          <button
            onClick={handleGoogleLogin}
            disabled={loadingAction}
            className="w-full bg-white text-gray-700 border border-gray-300 py-3 px-4 rounded-sm flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
            <span className="font-medium text-sm">Continue with Google</span>
          </button>
        </div>

        <div className="mt-10 text-center w-full pt-6 border-t border-rose-gold/20">
          <Link to="/admin/login" className="text-xs font-body text-deep-brown/60 hover:text-rose-gold transition-colors uppercase tracking-wider inline-flex items-center">
            Are you the owner? <span className="ml-1 text-rose-gold">Admin Login &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
