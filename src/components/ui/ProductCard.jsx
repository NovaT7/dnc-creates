import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col h-full bg-soft-white/40 cursor-pointer"
    >
      <Link to={`/shop/${product.id}`} className="block h-full flex flex-col relative overflow-hidden">
        {/* Badge */}
        {!product.inStock ? (
          <div className="absolute top-4 left-4 z-20 bg-gray-500 text-white text-xs font-body uppercase tracking-wider px-3 py-1">
            Out of Stock
          </div>
        ) : product.badge ? (
          <div className="absolute top-4 left-4 z-20 bg-rose-gold text-white text-xs font-body uppercase tracking-wider px-3 py-1">
            {product.badge}
          </div>
        ) : null}

        <button 
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-rose-gold hover:bg-rose-gold hover:text-white transition-colors shadow-sm"
          aria-label="Add to Wishlist"
        >
          <Heart size={16} fill={isWished ? 'currentColor' : 'none'} strokeWidth={isWished ? 0 : 2} />
        </button>
        
        {/* Image Box */}
        <div className="aspect-square w-full overflow-hidden bg-champagne mb-4 relative">
          <img 
            src={product.imageUrl || product.image || (product.imageUrls && product.imageUrls[0])} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${!product.inStock ? 'opacity-60 grayscale' : ''}`}
          />
          {/* Overlay gradient for a premium feel on hover */}
          <div className="absolute inset-0 bg-deep-brown/0 group-hover:bg-deep-brown/10 transition-colors duration-300 pointer-events-none" />
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/30 backdrop-grayscale pointer-events-none z-10" />
          )}
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
