import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, HeartHandshake, ShieldCheck, Diamond } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import { useProducts } from '../hooks/useProducts';

import logo2 from '../assets/images/logo2.png';

export default function Home() {
  const { featuredProducts, loading } = useProducts();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-deep-brown flex items-center justify-center overflow-hidden -mt-24 pt-24">
        {/* Animated Background Sparkles */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <motion.div 
            animate={{ opacity: [0.2, 0.8, 0.2] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4"
          >
            <Sparkles className="text-champagne w-8 h-8" />
          </motion.div>
          <motion.div 
            animate={{ opacity: [0.1, 0.5, 0.1] }} 
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-1/3 right-1/4"
          >
            <Sparkles className="text-champagne w-6 h-6" />
          </motion.div>
          <motion.div 
            animate={{ opacity: [0.2, 0.6, 0.2] }} 
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/3"
          >
            <Sparkles className="text-champagne w-10 h-10" />
          </motion.div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
          <motion.img 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            src={logo2} 
            alt="DNC Monogram" 
            className="w-32 md:w-40 mb-6 drop-shadow-2xl"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-accent text-4xl md:text-5xl text-rose-gold-light mb-4"
          >
            Crafted with love
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-display text-5xl md:text-7xl font-light mb-10 text-shimmer leading-tight"
          >
            Handcrafted Elegance for the Modern Soul
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/shop" className="btn-primary">
              Shop Collection
            </Link>
            <Link to="/about" className="btn-outline border-champagne text-champagne hover:bg-white/20 hover:text-white hover:border-transparent">
              Our Story
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-champagne/50"
        >
          <ArrowDown size={24} strokeWidth={1} />
        </motion.div>
      </section>

      {/* Categories Strip */}
      <section className="bg-champagne py-12 border-b border-rose-gold/20">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrolly flex items-center justify-center space-x-12 whitespace-nowrap">
          {CATEGORIES.slice(1).map((cat, i) => (
            <Link 
              key={cat} 
              to={`/shop?category=${cat}`} 
              className="font-display text-2xl text-deep-brown hover:text-rose-gold transition-colors tracking-widest uppercase flex items-center group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-gold mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-deep-brown mb-4">Curated Favorites</h2>
          <div className="ornament"></div>
          <p className="font-body text-deep-brown/70 max-w-xl mx-auto">
            Discover our most loved pieces, delicately handcrafted to bring a touch of timeless beauty to your collection.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <Link to="/shop" className="btn-outline">
            View All Pieces
          </Link>
        </div>
      </section>

      {/* Brand Promise */}
      <section className="bg-soft-white py-24 border-y border-rose-gold/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center text-rose-gold mb-6">
                <HeartHandshake size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl mb-3 text-deep-brown">Handcrafted with Love</h3>
              <p className="font-body text-deep-brown/70 text-sm leading-relaxed">
                Every piece is meticulously assembled by hand, ensuring uniqueness and imperfect perfection.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center text-rose-gold mb-6">
                <Diamond size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl mb-3 text-deep-brown">Premium Materials</h3>
              <p className="font-body text-deep-brown/70 text-sm leading-relaxed">
                We source only the finest metals and ethically gathered stones that stand the test of time.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center text-rose-gold mb-6">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl mb-3 text-deep-brown">Made to Order</h3>
              <p className="font-body text-deep-brown/70 text-sm leading-relaxed">
                Customizations available to make your jewellery as unique as your own story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-deep-brown text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1599643478514-4a4e0aebaa02?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-champagne mb-6 leading-tight">
            Have a Dream Design?
          </h2>
          <p className="font-body text-champagne/80 mb-10 leading-relaxed text-lg">
            Let's bring your vision to life. Work directly with us to design a custom piece that speaks to your heart.
          </p>
          <Link to="/contact" className="btn-primary">
            Request Custom Order
          </Link>
        </div>
      </section>
    </div>
  );
}
