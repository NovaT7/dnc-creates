import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Loader2, SearchX } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
        <Package size={48} className="mx-auto text-rose-gold/40 mb-6" strokeWidth={1} />
        <h1 className="text-4xl font-display text-deep-brown mb-4">Order History</h1>
        <p className="font-body text-deep-brown/70 mb-8 max-w-md mx-auto">
          Please log in to view your past orders.
        </p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="bg-champagne py-16 text-center border-b border-rose-gold/20">
        <h1 className="text-4xl md:text-5xl text-deep-brown mb-4 flex items-center justify-center gap-4">
          <Package className="text-rose-gold drop-shadow-sm" size={40} strokeWidth={1.5} />
          Order History
        </h1>
        <div className="ornament"></div>
        <p className="font-body tracking-widest uppercase text-sm text-deep-brown/70 mt-4">
          Review your past purchases
        </p>
      </header>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <Link to="/shop" className="inline-flex items-center text-sm font-body uppercase tracking-wider text-deep-brown/60 hover:text-rose-gold transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Continue Shopping
        </Link>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-rose-gold" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-soft-white border border-rose-gold/20 p-12 text-center rounded-sm">
            <SearchX size={48} className="mx-auto text-rose-gold/30 mb-4" strokeWidth={1} />
            <h2 className="text-2xl font-display text-deep-brown mb-3">No orders found</h2>
            <p className="font-body text-deep-brown/60 mb-6">You haven't placed any orders yet.</p>
            <Link to="/shop" className="btn-outline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-rose-gold/20 overflow-hidden shadow-sm rounded-sm">
                
                {/* Order Header */}
                <div className="bg-champagne/40 px-6 py-4 border-b border-rose-gold/10 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="font-body text-xs uppercase tracking-widest text-deep-brown/60 mb-1">
                      Order Placed
                    </p>
                    <p className="font-body text-deep-brown font-medium">
                      {order.createdAt.toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-widest text-deep-brown/60 mb-1">
                      Order ID
                    </p>
                    <p className="font-body text-deep-brown font-medium text-sm">
                      {order.id.toUpperCase().slice(0, 8)}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <p className="font-body text-xs uppercase tracking-widest text-deep-brown/60 mb-1">
                      Total
                    </p>
                    <p className="font-body text-rose-gold font-bold">
                      ₹{order.grandTotal.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-100 p-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                      <div className="w-20 h-20 bg-champagne flex-shrink-0 border border-gray-100 rounded-sm overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-rose-gold/20">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <Link to={`/shop/${item.id}`} className="font-display text-lg text-deep-brown hover:text-rose-gold hover:underline transition-colors block mb-1">
                          {item.name}
                        </Link>
                        <p className="font-body text-sm text-deep-brown/60 mb-2">Qty: {item.qty}</p>
                        <p className="font-body text-deep-brown font-medium">₹{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
