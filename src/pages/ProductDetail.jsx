import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowLeft, HeartHandshake, Diamond, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const { addItem } = useCart();
  
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        
        {/* Left: Image */}
        <div className="bg-champagne p-6 rounded-sm">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover shadow-sm"
          />
        </div>

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
            <button 
              onClick={handleAddToCart}
              className={`py-4 px-8 font-body uppercase tracking-[0.2em] text-sm font-medium transition-all duration-300 flex items-center justify-center ${
                added 
                  ? 'bg-green-600 text-white' 
                  : 'bg-rose-gold hover:bg-rose-gold-dark text-white'
              }`}
            >
              {added ? (
                <>
                  <Check size={18} className="mr-2" /> Added to Cart
                </>
              ) : (
                'Add to Cart - ₹' + product.price
              )}
            </button>

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
