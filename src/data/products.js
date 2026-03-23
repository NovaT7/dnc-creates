export const CATEGORIES = ['All', 'Rings', 'Lockets', 'Keychains', 'Bracelets'];

export const PRODUCTS = [
  {
    id: '1',
    name: 'Rose Gold Diamond Promise Ring',
    category: 'Rings',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b454bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b454bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A beautiful rose gold promise ring adorned with a hand-selected diamond. Perfect for special moments.',
    badge: 'Bestseller',
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Vintage Heart Locket',
    category: 'Lockets',
    price: 899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An elegant vintage-style heart locket that can hold two delicate photos.',
    badge: 'New',
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Initial Charm Keychain',
    category: 'Keychains',
    price: 499,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1628042468794-521ee4c1f939?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1628042468794-521ee4c1f939?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Customizable keychain with a rose gold initial charm. Made to order.',
    badge: null,
    inStock: true,
    featured: false,
  },
  {
    id: '4',
    name: 'Delicate Pearl Bracelet',
    category: 'Bracelets',
    price: 749,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1573408301145-b98c4af01558?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1573408301145-b98c4af01558?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A delicate chain bracelet featuring genuine freshwater pearls.',
    badge: 'Limited',
    inStock: true,
    featured: true,
  },
  {
    id: '5',
    name: 'Eternity Band Ring',
    category: 'Rings',
    price: 1099,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A classic eternity band that shines from every angle.',
    badge: null,
    inStock: true,
    featured: false,
  },
  {
    id: '6',
    name: 'Floral Engraved Locket',
    category: 'Lockets',
    price: 1199,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1599643478514-4a4e0aebaa02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643478514-4a4e0aebaa02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Intricately engraved floral pattern on a beautiful circular locket.',
    badge: 'Popular',
    inStock: true,
    featured: true,
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.featured);
