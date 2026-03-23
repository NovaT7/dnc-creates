import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

export default function Shop() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState('featured'); // featured, low-high, high-low

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    
    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    // Sort
    if (sortOrder === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // 'featured' primarily sorts featured products first, then by ID
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    return result;
  }, [activeCategory, sortOrder]);

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-champagne py-16 text-center border-b border-rose-gold/20">
        <h1 className="text-5xl text-deep-brown mb-4">Our Collection</h1>
        <div className="ornament"></div>
        <p className="font-body tracking-widest uppercase text-sm text-deep-brown/70 mt-4">
          Explore our handcrafted pieces
        </p>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        
        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rose-gold/20 pb-8 mb-12">
          
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-4 mb-6 md:mb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-body uppercase tracking-wider text-sm px-4 py-2 transition-colors duration-300 border-b-2 ${
                  activeCategory === cat 
                    ? 'border-rose-gold text-rose-gold' 
                    : 'border-transparent text-deep-brown/60 hover:text-deep-brown'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="font-body text-sm text-deep-brown/60 uppercase tracking-widest">Sort:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent border border-rose-gold/30 font-body text-deep-brown text-sm px-4 py-2 focus:outline-none focus:border-rose-gold"
            >
              <option value="featured">Featured First</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="font-display text-3xl text-deep-brown mb-4">No pieces found</h3>
            <p className="font-body text-deep-brown/70 mb-8">
              We couldn't find any products in this category at the moment.
            </p>
            <button 
              onClick={() => setActiveCategory('All')} 
              className="btn-outline"
            >
              View All Pieces
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
