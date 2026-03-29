import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { PRODUCTS, FEATURED_PRODUCTS } from '../data/products';

export function useProducts() {
  const [products, setProducts] = useState(PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState(FEATURED_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(firestoreProducts);
        setFeaturedProducts(firestoreProducts.filter(p => p.featured));
      } else {
        // Fallback to static if Firestore is empty
        setProducts(PRODUCTS);
        setFeaturedProducts(FEATURED_PRODUCTS);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore error: ", err);
      // Fallback on error
      setProducts(PRODUCTS);
      setFeaturedProducts(FEATURED_PRODUCTS);
      setError(err);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { products, featuredProducts, loading, error };
}
