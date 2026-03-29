import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const { products, loading: productsLoading } = useProducts();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
        <Heart size={48} className="mx-auto text-rose-gold/40 mb-6" strokeWidth={1} />
        <h1 className="text-4xl font-display text-deep-brown mb-4">Your Wishlist</h1>
        <p className="font-body text-deep-brown/70 mb-8 max-w-md mx-auto">
          Please log in to view and save your favourite items.
        </p>
        <Link to="/login" className="btn-primary">Login to Continue</Link>
      </div>
    );
  }

  const isLoading = wishlistLoading || productsLoading;
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="w-full">
      <header className="bg-champagne py-16 text-center border-b border-rose-gold/20">
        <h1 className="text-5xl text-deep-brown mb-4 flex items-center justify-center gap-4">
          <Heart className="text-rose-gold drop-shadow-sm" fill="#B76E79" size={40} />
          Your Wishlist
        </h1>
        <div className="ornament"></div>
        <p className="font-body tracking-widest uppercase text-sm text-deep-brown/70 mt-4">
          Your Personal Collection
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <Link to="/shop" className="inline-flex items-center text-sm font-body uppercase tracking-wider text-deep-brown/60 hover:text-rose-gold transition-colors mb-12">
          <ArrowLeft size={16} className="mr-2" /> Continue Shopping
        </Link>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : wishlistedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-rose-gold/30 mb-6" strokeWidth={1.5} />
            <h2 className="text-2xl font-display text-deep-brown mb-4">Your wishlist is empty</h2>
            <p className="font-body text-deep-brown/70 mb-8 max-w-sm mx-auto">
              Save your favourite items here while discovering elegant handcrafted pieces.
            </p>
            <Link to="/shop" className="btn-primary">Explore Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
