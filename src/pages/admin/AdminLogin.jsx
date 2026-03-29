import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const { user, isAdmin, loginWithEmail, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingAction(true);

    try {
      if (email !== import.meta.env.VITE_ADMIN_EMAIL) {
        throw new Error("Unauthorized: Not an admin email");
      }
      await loginWithEmail(email, password);
      
      // Secondary check: verify the env var matches
      setTimeout(async () => {
         const currentEmail = user?.email || email;
         if (currentEmail !== import.meta.env.VITE_ADMIN_EMAIL) {
           await logout();
           setError("Access denied.");
         }
      }, 500);
    } catch (err) {
      setError(err.message);
      await logout();
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-brown flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="text-rose-gold text-xs font-body uppercase tracking-widest mb-12 hover:text-champagne transition-colors">
        &larr; Back to site
      </Link>
      
      <div className="max-w-md w-full bg-soft-white rounded-sm shadow-xl p-8 border-t-4 border-rose-gold">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl text-deep-brown mb-2">DNC Creates — Admin</h2>
          <div className="w-12 h-0.5 bg-rose-gold mx-auto mt-4"></div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm rounded-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-body tracking-wider uppercase text-deep-brown/80 mb-2">Admin Email</label>
            <input
              type="email"
              required
              className="w-full bg-champagne/30 border border-deep-brown/20 p-3 focus:outline-none focus:border-rose-gold focus:bg-transparent transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-body tracking-wider uppercase text-deep-brown/80 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-champagne/30 border border-deep-brown/20 p-3 focus:outline-none focus:border-rose-gold focus:bg-transparent transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loadingAction}
            className="w-full bg-deep-brown hover:bg-black text-white font-body uppercase tracking-widest text-sm py-4 transition-colors disabled:opacity-50"
          >
            {loadingAction ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
