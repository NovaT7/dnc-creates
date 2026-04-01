import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, LogOut, LayoutDashboard, Heart, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navbarSearchQuery, setNavbarSearchQuery] = useState('');
  
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const isHome = location.pathname === '/';
  
  const [bounceKey, setBounceKey] = useState(0);
  const prevTotal = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setBounceKey(prev => prev + 1);
    }
    prevTotal.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsSearchOpen(false); // Close search on route change
  }, [location.pathname]);

  // Close dropdown or search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navbarSearchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(navbarSearchQuery.trim())}`);
      setIsSearchOpen(false);
      setNavbarSearchQuery('');
    }
  };

  const navClasses = `fixed w-full top-0 z-50 transition-all duration-300 ${
    isHome && !isScrolled
      ? 'bg-transparent text-white py-6'
      : 'bg-soft-white/95 backdrop-blur-md shadow-sm text-deep-brown py-4'
  }`;

  const linkClasses = ({ isActive }) =>
    `uppercase tracking-widest text-sm font-medium transition-colors hover:text-rose-gold ${
      isActive ? 'text-rose-gold' : ''
    }`;

  const getInitials = () => {
    const name = user?.displayName || user?.email || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link to="/" className="font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.1em]">
              <span className={isHome && !isScrolled ? 'text-white' : 'text-shimmer'}>
                DNC Creates
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-10">
            <NavLink to="/" className={linkClasses}>Home</NavLink>
            <NavLink to="/shop" className={linkClasses}>Shop</NavLink>
            <NavLink to="/about" className={linkClasses}>About</NavLink>
            <NavLink to="/contact" className={linkClasses}>Contact</NavLink>
          </div>

          {/* Right: Admin + Cart + User */}
          <div className="flex items-center justify-end gap-4">
            {/* Global Search */}
            <div className="relative" ref={searchRef}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearchSubmit}
                    className="absolute right-full mr-2 hidden md:block"
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      autoFocus
                      value={navbarSearchQuery}
                      onChange={(e) => setNavbarSearchQuery(e.target.value)}
                      className={`bg-transparent border-b border-rose-gold/50 outline-none text-sm transition-all py-1 ${isHome && !isScrolled ? 'text-white placeholder-white/50' : 'text-deep-brown placeholder-deep-brown/40'}`}
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center justify-center hover:text-rose-gold transition-colors p-1"
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                title="Search"
              >
                {isSearchOpen ? <X size={24} strokeWidth={1.5} /> : <Search size={24} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Admin Panel Icon — only for admin */}
            {isAdmin && (
              <Link
                to="/admin"
                title="Admin Panel"
                className="p-1 hover:text-rose-gold transition-colors"
              >
                <LayoutDashboard size={24} strokeWidth={1.5} />
              </Link>
            )}

            {/* Wishlist Icon */}
            {user && (
              <Link to="/wishlist" className="p-1 hover:text-rose-gold transition-colors" title="Wishlist">
                <Heart size={24} strokeWidth={1.5} />
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="p-1 relative hover:text-rose-gold transition-colors block" aria-label={`View shopping cart with ${totalItems} items`}>
              <motion.div
                key={bounceKey}
                animate={bounceKey > 0 ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ShoppingBag size={24} strokeWidth={1.5} />
              </motion.div>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    key={totalItems}
                    initial={{ y: 10, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -10, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-2 -right-2 bg-rose-gold text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center transform origin-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User / Auth */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-rose-gold text-white flex items-center justify-center text-sm font-medium overflow-hidden hover:ring-2 hover:ring-rose-gold/50 transition-all"
                  aria-label="User menu"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-rose-gold/10 rounded-sm overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-rose-gold/10">
                        <p className="text-xs text-deep-brown/50 uppercase tracking-wider">Logged in as</p>
                        <p className="text-sm font-medium text-deep-brown truncate">{user.displayName || user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-deep-brown/70 hover:text-rose-gold hover:bg-rose-gold/5 transition-colors border-b border-rose-gold/5"
                      >
                        <ShoppingBag size={14} />
                        Order History
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-deep-brown/70 hover:text-rose-gold hover:bg-rose-gold/5 transition-colors"
                        >
                          <LayoutDashboard size={14} />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-deep-brown/70 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden md:block uppercase tracking-widest text-sm font-medium transition-colors hover:text-rose-gold ${isHome && !isScrolled ? 'text-white/80' : 'text-deep-brown/60'}`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay — specifically for the "search icon" click */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden absolute top-full left-0 w-full px-6 py-4 z-40 shadow-lg border-b border-rose-gold/10 ${
              isHome && !isScrolled ? 'bg-deep-brown shadow-black/20' : 'bg-soft-white/95 backdrop-blur-md'
            }`}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search our collection..."
                autoFocus
                value={navbarSearchQuery}
                onChange={(e) => setNavbarSearchQuery(e.target.value)}
                className="w-full bg-white border border-rose-gold/20 rounded-2xl px-5 py-3 pr-12 text-deep-brown font-body text-sm focus:outline-none focus:border-rose-gold shadow-inner"
              />
              <button 
                type="submit" 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-gold hover:text-rose-gold-dark"
              >
                <Search size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-soft-white border-t border-rose-gold/20 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 space-y-4 text-deep-brown">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={navbarSearchQuery}
                  onChange={(e) => setNavbarSearchQuery(e.target.value)}
                  className="w-full bg-rose-gold/5 border border-rose-gold/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-rose-gold"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-gold">
                  <Search size={16} />
                </button>
              </form>

              <NavLink to="/" className={linkClasses}>Home</NavLink>
              <NavLink to="/shop" className={linkClasses}>Shop</NavLink>
              <NavLink to="/about" className={linkClasses}>About</NavLink>
              <NavLink to="/contact" className={linkClasses}>Contact</NavLink>
              {!user && (
                <NavLink to="/login" className={linkClasses}>Login</NavLink>
              )}
              {user && (
                <NavLink to="/orders" className={linkClasses}>Order History</NavLink>
              )}
              {user && isAdmin && (
                <NavLink to="/admin" className={linkClasses}>Admin Panel</NavLink>
              )}
              {user && (
                <button onClick={logout} className="text-left uppercase tracking-widest text-sm font-medium text-red-400 hover:text-red-600 transition-colors">
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
