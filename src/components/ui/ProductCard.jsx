import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col h-full bg-soft-white/40 cursor-pointer"
    >
      <Link to={`/shop/${product.id}`} className="block h-full flex flex-col relative overflow-hidden">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 bg-rose-gold text-white text-xs font-body uppercase tracking-wider px-3 py-1">
            {product.badge}
          </div>
        )}
        
        {/* Image Box */}
        <div className="aspect-[4/5] overflow-hidden bg-champagne mb-4 relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Overlay gradient for a premium feel on hover */}
          <div className="absolute inset-0 bg-deep-brown/0 group-hover:bg-deep-brown/10 transition-colors duration-300 pointer-events-none" />
        </div>

        {/* Details Box */}
        <div className="px-2 pb-4 flex flex-col flex-grow text-center">
          <span className="text-rose-gold/70 text-xs font-body uppercase tracking-widest mb-2 block">
            {product.category}
          </span>
          <h3 className="font-display text-lg text-deep-brown mb-2 leading-snug">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-center space-x-2">
            <span className="font-body text-deep-brown font-medium">₹{product.price}</span>
            {product.originalPrice && (
              <span className="font-body text-deep-brown/40 line-through text-sm">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
