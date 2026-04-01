import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowLeft, HeartHandshake, Diamond, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../context/WishlistContext';

// Resolves the list of images from product (supports imageUrls array + legacy imageUrl/image)
function getImageUrls(product) {
  if (product.imageUrls && product.imageUrls.length > 0) return product.imageUrls;
  const single = product.imageUrl || product.image;
  return single ? [single] : [];
}

import { optimizeImage } from '../utils/imgUtils';

function ImageGallery({ product }) {
  const images = getImageUrls(product);
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-champagne p-6 rounded-sm flex items-center justify-center h-80 text-deep-brown/30 text-sm">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile Swipe Gallery (Hidden on Desktop) */}
      <div 
        className="flex md:hidden overflow-x-auto snap-x snap-mandatory w-full aspect-square bg-champagne rounded-sm"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
        {images.map((url, i) => (
          <img
            key={`mobile-${i}`}
            src={optimizeImage(url, { width: 800, quality: 80 })}
            alt={`${product.name} ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className="w-full h-full object-cover shrink-0 snap-center scrollbar-hide"
          />
        ))}
      </div>

      {/* Desktop Main image (Hidden on Mobile) */}
      <div className="hidden md:block bg-champagne rounded-sm overflow-hidden aspect-square w-full">
        <img
          src={optimizeImage(images[activeIdx], { width: 1000, quality: 80 })}
          alt={product.name}
          width="1000"
          height="1000"
          loading="eager" 
          fetchPriority="high"
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
      
      {/* Desktop Thumbnails — only show if multiple images */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-2 flex-wrap">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-16 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                i === activeIdx ? 'border-rose-gold' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={optimizeImage(url, { width: 200, quality: 60 })} 
                alt={`View ${i + 1}`} 
                className="w-full h-full object-cover" 
                loading="lazy"
                width="80"
                height="80"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = products.find(p => p.id === id);
  const { addItem, items: cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [added, setAdded] = useState(false);
  
  const isWished = product ? isInWishlist(product.id) : false;
  const isInCart = product ? cartItems.some(i => i.id === product.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="w-24 h-4 skeleton rounded-sm mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-square skeleton rounded-sm"></div>
            <div className="flex gap-2">
              <div className="w-16 h-16 skeleton rounded-sm"></div>
              <div className="w-16 h-16 skeleton rounded-sm"></div>
              <div className="w-16 h-16 skeleton rounded-sm"></div>
            </div>
          </div>
          {/* Details Skeleton */}
          <div className="flex flex-col justify-center">
            <div className="w-24 h-3 skeleton mb-3 rounded-sm"></div>
            <div className="w-3/4 h-10 skeleton mb-4 rounded-sm"></div>
            <div className="w-32 h-8 skeleton mb-8 rounded-sm"></div>
            <div className="w-full h-4 skeleton mb-2 rounded-sm"></div>
            <div className="w-5/6 h-4 skeleton mb-8 rounded-sm"></div>
            <div className="w-full h-14 skeleton mb-4 rounded-sm"></div>
            <div className="w-full h-14 skeleton mb-12 rounded-sm"></div>
            <div className="grid grid-cols-3 gap-4 border-t border-rose-gold/20 pt-8">
              <div className="h-20 skeleton rounded-sm"></div>
              <div className="h-20 skeleton rounded-sm"></div>
              <div className="h-20 skeleton rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <h2 className="text-3xl font-display text-deep-brown mb-4">Product Not Found</h2>
        <Link to="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center text-sm font-body uppercase tracking-wider text-deep-brown/60 hover:text-rose-gold transition-colors mb-12">
        <ArrowLeft size={16} className="mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Gallery */}
        <ImageGallery product={product} />

        {/* Right: Details */}
        <div className="flex flex-col justify-center">
          <span className="text-rose-gold text-sm font-body uppercase tracking-[0.2em] mb-3">
            {product.category}
          </span>
          <h1 className="font-display text-4xl lg:text-5xl text-deep-brown mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-end space-x-4 mb-8">
            <span className="font-body text-3xl text-deep-brown font-medium">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="font-body text-xl text-deep-brown/40 line-through mb-1">
                  ₹{product.originalPrice}
                </span>
                <span className="bg-rose-gold-light/20 text-rose-gold-dark text-xs font-bold px-2 py-1 mb-1.5 rounded-sm uppercase tracking-wider">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <p className="font-body text-deep-brown/80 leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          <div className="flex flex-col space-y-4 mb-12">
            <div className="flex space-x-4">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-grow py-4 px-8 font-body uppercase tracking-[0.2em] text-sm font-medium transition-all duration-300 flex items-center justify-center ${
                  !product.inStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : isInCart || added 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-rose-gold hover:bg-rose-gold-dark text-white'
                }`}
              >
                {!product.inStock ? (
                  'Out of Stock'
                ) : added ? (
                  <>
                    <Check size={18} className="mr-2" /> Added to Cart
                  </>
                ) : isInCart ? (
                  <>
                    <Check size={18} className="mr-2" /> Add Another
                  </>
                ) : (
                  'Add to Cart - ₹' + product.price
                )}
              </button>

              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`shrink-0 w-14 flex flex-col items-center justify-center border-2 transition-colors ${
                  isWished 
                    ? 'border-rose-gold bg-rose-gold/5 text-rose-gold' 
                    : 'border-rose-gold/30 text-rose-gold hover:border-rose-gold hover:bg-rose-gold hover:text-white'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart size={20} fill={isWished ? 'currentColor' : 'none'} strokeWidth={isWished ? 0 : 2} />
              </button>
            </div>

            <Link 
              to={`/contact?subject=Custom Order Enquiry: ${product.name}`} 
              className="btn-outline w-full text-center"
            >
              Custom Order Enquiry
            </Link>
          </div>

          {/* Badges */}
          <div className="border-t border-rose-gold/20 pt-8 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center justify-start text-deep-brown text-opacity-80">
              <HeartHandshake size={24} className="text-rose-gold mb-2" strokeWidth={1} />
              <span className="font-body text-[10px] uppercase tracking-wider">Handcrafted</span>
            </div>
            <div className="flex flex-col items-center justify-start text-deep-brown text-opacity-80">
              <Diamond size={24} className="text-rose-gold mb-2" strokeWidth={1} />
              <span className="font-body text-[10px] uppercase tracking-wider">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center justify-start text-deep-brown text-opacity-80">
              <ShieldCheck size={24} className="text-rose-gold mb-2" strokeWidth={1} />
              <span className="font-body text-[10px] uppercase tracking-wider">Secure</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
