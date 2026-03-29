import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const shipping = totalPrice > 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;
  const hasOutOfStock = items.some(item => item.inStock === false);

  const whatsappNumber = import.meta.env.VITE_OWNER_WHATSAPP;

  const buildWhatsAppMessage = () => {
    const itemLines = items.map((item, i) =>
      `${i + 1}. ${item.name} (${item.category})\n   Qty: ${item.qty} × ₹${item.price} = ₹${item.price * item.qty}`
    ).join('\n');

    const customerName = user?.displayName || 'Guest';

    const message = `🛍️ *New Order — DNC Creates*\n\n${itemLines}\n\n━━━━━━━━━━━━━━━━\n👤 *Customer:* ${customerName}\n🧾 *Total Items:* ${totalItems}\n💰 *Grand Total:* ₹${grandTotal}${shipping > 0 ? ` (incl. ₹${shipping} shipping)` : ' (Free Shipping)'}\n\nPlease confirm availability and share payment details. Thank you! 🌸`;

    return encodeURIComponent(message);
  };

  const handleWhatsApp = async () => {
    if (user) {
      setIsProcessing(true);
      try {
        const orderData = {
          userId: user.uid,
          customerName: user.displayName || user.email || 'Customer',
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            imageUrl: item.imageUrls?.[0] || item.imageUrl || item.image || null
          })),
          totalItems,
          subtotal: totalPrice,
          shipping,
          grandTotal,
          status: 'Pending',
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'orders'), orderData);
        clearCart();
      } catch (error) {
        console.error("Error saving order:", error);
      } finally {
        setIsProcessing(false);
      }
    }
    
    const url = `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-24 px-4">
        <ShoppingBag size={80} strokeWidth={0.8} className="text-rose-gold opacity-20 mb-6" />
        <h2 className="font-display text-4xl text-deep-brown mb-3">Your cart is empty</h2>
        <p className="font-body text-deep-brown/60 mb-8 text-center max-w-sm">
          Discover our handcrafted jewellery and fill your cart with something beautiful.
        </p>
        <Link to="/shop" className="btn-primary">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl text-deep-brown mb-2">Shopping Cart</h1>
      <div className="ornament mb-8"></div>

      {/* Guest Banner */}
      {!user && (
        <div className="mb-8 bg-champagne/60 border border-rose-gold/20 p-4 flex items-center justify-between rounded-sm">
          <p className="font-body text-deep-brown text-sm">
            <span className="font-medium">Login to save your cart across devices</span>
          </p>
          <Link to="/login" state={{ from: '/cart' }} className="btn-primary text-xs py-2 px-4">
            Login
          </Link>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Items */}
        <div className="flex-1">
          <div className="divide-y divide-rose-gold/10">
            {items.map(item => (
              <div key={item.id} className="flex gap-5 py-6 group">
                {/* Image */}
                <div className="w-24 bg-champagne rounded-sm overflow-hidden flex-shrink-0 aspect-square">
                  {(item.imageUrl || item.image || (item.imageUrls && item.imageUrls[0])) && (
                    <img src={item.imageUrl || item.image || (item.imageUrls && item.imageUrls[0])} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/shop/${item.id}`} className="font-display text-lg text-deep-brown hover:text-rose-gold transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      {item.inStock === false && (
                        <span className="bg-red-100 text-red-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm whitespace-nowrap">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="font-body text-xs text-deep-brown/50 uppercase tracking-widest mb-3">{item.category}</p>

                  <div className="flex items-center justify-between">
                    {/* Qty Controls */}
                    <div className="flex items-center border border-rose-gold/20">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-deep-brown hover:text-rose-gold hover:bg-rose-gold/5 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-body text-sm text-deep-brown">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-deep-brown hover:text-rose-gold hover:bg-rose-gold/5 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-body text-deep-brown font-medium">₹{(item.price * item.qty).toLocaleString()}</p>
                      {item.qty > 1 && (
                        <p className="text-xs text-deep-brown/40">₹{item.price} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-4 pt-4 border-t border-rose-gold/10">
            <button
              onClick={clearCart}
              className="font-body text-xs uppercase tracking-widest text-deep-brown/40 hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:w-80">
          <div className="bg-soft-white border border-rose-gold/20 p-6 rounded-sm sticky top-28">
            <h3 className="font-display text-2xl text-deep-brown mb-5">Order Summary</h3>

            <div className="space-y-3 font-body text-sm mb-5">
              <div className="flex justify-between text-deep-brown/70">
                <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-deep-brown/70">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              <div className="border-t border-rose-gold/20 pt-3 flex justify-between items-center">
                <span className="font-medium text-deep-brown">Grand Total</span>
                <span className="text-2xl text-rose-gold font-medium">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs font-body text-deep-brown/50 bg-champagne/50 rounded-sm p-2 text-center mb-5">
                🎁 Free shipping on orders above ₹999
              </p>
            )}

            {hasOutOfStock && (
              <div className="mb-5 bg-red-50 text-red-600 border border-red-100 p-3 rounded-sm text-xs font-body text-center leading-relaxed">
                One or more items in your cart are out of stock. Please remove them to proceed with your order.
              </div>
            )}

            <button
              onClick={handleWhatsApp}
              disabled={hasOutOfStock || items.length === 0 || isProcessing}
              className={`w-full flex items-center justify-center gap-2 py-4 font-body uppercase tracking-widest text-sm transition-colors ${
                hasOutOfStock || items.length === 0 || isProcessing
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
              {isProcessing ? 'Processing...' : 'Order via WhatsApp'}
            </button>

            <Link to="/shop" className="block text-center mt-4 font-body text-xs text-deep-brown/50 hover:text-rose-gold transition-colors uppercase tracking-widest">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
