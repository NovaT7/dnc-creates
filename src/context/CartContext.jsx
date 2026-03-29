import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Load from local storage initially if not logged in
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem('dnc-cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (error) {
          setItems([]);
        }
      }
    }
  }, [user]);

  // Sync with Firestore when user logs in/changes
  useEffect(() => {
    if (!user) return;

    const cartRef = doc(db, 'carts', user.uid);
    let unsubscribe = () => {};

    const syncCart = async () => {
      setSyncing(true);
      const cartDoc = await getDoc(cartRef);
      const localCartStr = localStorage.getItem('dnc-cart');
      let localCart = [];
      try {
        if (localCartStr) localCart = JSON.parse(localCartStr);
      } catch (e) {}

      let mergedItems = [];
      if (cartDoc.exists()) {
        const firestoreCart = cartDoc.data().items || [];
        // Merging: Combine items based on ID
        const combined = [...firestoreCart];
        for (const localItem of localCart) {
          const existing = combined.find(i => i.id === localItem.id);
          if (existing) {
            existing.qty = Math.max(existing.qty, localItem.qty);
          } else {
            combined.push(localItem);
          }
        }
        mergedItems = combined;
      } else {
        mergedItems = localCart;
      }
      
      await setDoc(cartRef, { items: mergedItems, updatedAt: new Date().toISOString() }, { merge: true });
      localStorage.removeItem('dnc-cart'); // Clear local cart after merge

      // Setup listener
      unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          setItems(docSnap.data().items || []);
        } else {
          setItems([]);
        }
        setSyncing(false);
      });
    };

    syncCart();

    return () => unsubscribe();
  }, [user]);

  // Update logic
  const saveCart = async (newItems) => {
    setItems(newItems);
    if (user) {
      setSyncing(true);
      await setDoc(doc(db, 'carts', user.uid), {
        items: newItems,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSyncing(false);
    } else {
      localStorage.setItem('dnc-cart', JSON.stringify(newItems));
    }
  };

  const addItem = (product) => {
    const existing = items.find(item => item.id === product.id);
    let newItems;
    if (existing) {
      newItems = items.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image || product.imageUrl || null, // handle different image keys
        qty: 1
      };
      newItems = [...items, cartItem];
    }
    saveCart(newItems);
  };

  const removeItem = (id) => {
    saveCart(items.filter(item => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) {
      removeItem(id);
      return;
    }
    saveCart(items.map(item => 
      item.id === id ? { ...item, qty } : item
    ));
  };

  const clearCart = () => saveCart([]);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const value = {
    items,
    syncing,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
