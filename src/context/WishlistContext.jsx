import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist on auth state change
  useEffect(() => {
    let isMounted = true;
    
    async function loadWishlist() {
      if (!user) {
        if (isMounted) {
          setWishlist([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists() && userDoc.data().wishlist) {
          if (isMounted) setWishlist(userDoc.data().wishlist);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWishlist();
    
    return () => { isMounted = false; };
  }, [user]);

  // Sync with Firestore whenever updated locally
  const syncWishlist = async (newWishlist) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { wishlist: newWishlist }, { merge: true });
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please login to save items to your wishlist.");
      return;
    }

    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      // Async sync
      syncWishlist(newWishlist);
      return newWishlist;
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
