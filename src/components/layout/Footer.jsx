import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-deep-brown text-champagne pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold text-rose-gold-light mb-6">DNC Creates</h3>
            <p className="font-body text-champagne/80 text-sm leading-relaxed max-w-sm">
              Handcrafted jewellery & accessories made with love and attention to detail. 
              Elevate your everyday style with our timeless pieces.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="hover:text-rose-gold transition-colors" aria-label="Follow us on Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-rose-gold transition-colors" aria-label="Follow us on Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body uppercase tracking-widest text-sm font-medium mb-6 text-rose-gold-light">Quick Links</h4>
            <ul className="space-y-3 font-body text-sm text-champagne/80">
              <li><Link to="/shop" className="hover:text-rose-gold transition-colors">Shop Collection</Link></li>
              <li><Link to="/about" className="hover:text-rose-gold transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-rose-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/cart" className="hover:text-rose-gold transition-colors">Your Cart</Link></li>
              <li><a href="#" className="hover:text-rose-gold transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-rose-gold transition-colors">Care Guide</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body uppercase tracking-widest text-sm font-medium mb-6 text-rose-gold-light">Get in Touch</h4>
            <ul className="space-y-4 font-body text-sm text-champagne/80">
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-rose-gold shrink-0 mt-0.5" />
                <a href="mailto:hello@dnccreates.com" className="hover:text-rose-gold transition-colors">hello@dnccreates.com</a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-rose-gold shrink-0 mt-0.5" />
                <a href="tel:+919876543210" className="hover:text-rose-gold transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-rose-gold shrink-0 mt-0.5" />
                <span>Available nationwide.<br/>Studio visits by appointment only.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-rose-gold-dark/30 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-champagne/60 font-body">
          <p>&copy; {new Date().getFullYear()} DNC Creates. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Crafted with <span className="text-rose-gold mx-1">♡</span> by DNC
          </p>
        </div>
      </div>
    </footer>
  );
}
