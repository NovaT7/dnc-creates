import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navClasses = `fixed w-full top-0 z-50 transition-all duration-300 ${
    isHome && !isScrolled
      ? 'bg-transparent text-white py-6'
      : 'bg-soft-white/95 backdrop-blur-md shadow-sm text-deep-brown py-4'
  }`;

  const linkClasses = ({ isActive }) =>
    `uppercase tracking-widest text-sm font-medium transition-colors hover:text-rose-gold ${
      isActive ? 'text-rose-gold' : ''
    }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link to="/" className="font-display text-3xl font-semibold">
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

          {/* Cart Icon */}
          <div className="flex items-center justify-end">
            <Link to="/cart" className="relative hover:text-rose-gold transition-colors">
              <ShoppingBag size={24} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-gold text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

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
              <NavLink to="/" className={linkClasses}>Home</NavLink>
              <NavLink to="/shop" className={linkClasses}>Shop</NavLink>
              <NavLink to="/about" className={linkClasses}>About</NavLink>
              <NavLink to="/contact" className={linkClasses}>Contact</NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
