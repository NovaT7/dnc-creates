import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OWNER_WHATSAPP = '919365682130'; 

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shippingCost = totalPrice > 999 ? 0 : 99;
  const grandTotal = totalPrice + shippingCost;

  const handleWhatsAppOrder = () => {
    let message = `🛍️ *New Order — DNC Creates*\n\n`;
    
    items.forEach((item, index) => {
      const subtotal = item.qty * item.price;
      message += `${index + 1}. *${item.name}* (${item.category})\n`;
      message += `   Qty: ${item.qty} × ₹${item.price} = ₹${subtotal}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `🧾 *Total Items:* ${totalItems}\n`;
    message += `💰 *Subtotal:* ₹${totalPrice}\n`;
    message += `🚚 *Shipping:* ${shippingCost === 0 ? 'Free' : '₹' + shippingCost}\n`;
    message += `💳 *Grand Total: ₹${grandTotal}*\n\n`;
    
    if (shippingCost === 0) {
      message += `_(Includes Free Shipping for orders above ₹999)_\n\n`;
    }
    
    message += `"Please confirm availability and share payment details. Thank you! 🌸"`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-champagne rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-rose-gold" strokeWidth={1} />
        </div>
        <h2 className="font-display text-4xl text-deep-brown mb-4">Your Cart is Empty</h2>
        <p className="font-body text-deep-brown/70 mb-8 max-w-md">
          Looks like you haven't added any beautiful pieces to your collection yet.
        </p>
        <Link to="/shop" className="btn-primary">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl lg:text-5xl text-deep-brown mb-12">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="border border-rose-gold/20 rounded-sm">
            
            {/* Table Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-champagne/30 border-b border-rose-gold/20 text-xs font-body uppercase tracking-wider text-deep-brown/70">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Item Rows */}
            <div className="divide-y divide-rose-gold/20">
              {items.map(item => (
                <div key={item.id} className="p-6 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 group">
                  
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-24 object-cover bg-champagne"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-rose-gold uppercase tracking-wider mb-1 font-body">
                        {item.category}
                      </span>
                      <Link to={`/shop/${item.id}`} className="font-display text-xl text-deep-brown hover:text-rose-gold transition-colors block leading-tight mb-1">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-rose-gold-dark/60 hover:text-rose-gold-dark transition-colors inline-flex items-center w-fit font-body uppercase tracking-wider mt-2 group-hover:opacity-100 md:opacity-0"
                      >
                        <Trash2 size={12} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price (Mobile & Desktop) */}
                  <div className="col-span-2 text-left md:text-center mt-2 md:mt-0 font-body text-deep-brown font-medium">
                    <span className="md:hidden text-xs text-deep-brown/60 tracking-wider mr-2 uppercase">Price:</span>
                    ₹{item.price}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex justify-start md:justify-center items-center mt-2 md:mt-0">
                    <div className="flex items-center border border-rose-gold/30">
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-3 py-1 text-deep-brown/60 hover:text-rose-gold transition-colors focus:outline-none"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-body text-sm w-8 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-3 py-1 text-deep-brown/60 hover:text-rose-gold transition-colors focus:outline-none"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2 text-left md:text-right mt-2 md:mt-0 font-body text-lg text-deep-brown font-medium">
                    <span className="md:hidden text-xs text-deep-brown/60 tracking-wider mr-2 uppercase">Subtotal:</span>
                    ₹{item.price * item.qty}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Link to="/shop" className="text-sm font-body uppercase tracking-wider text-rose-gold hover:text-deep-brown transition-colors">
              Continue Shopping
            </Link>
            <button 
              onClick={clearCart}
              className="text-sm font-body uppercase tracking-wider text-deep-brown/60 hover:text-rose-gold transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-champagne/40 p-8 border border-rose-gold/20">
            <h3 className="font-display text-2xl text-deep-brown mb-6">Order Summary</h3>
            
            <div className="space-y-4 font-body text-sm mb-6 pb-6 border-b border-rose-gold/20">
              <div className="flex justify-between text-deep-brown/80">
                <span>Items ({totalItems})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-deep-brown/80">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : '₹' + shippingCost}</span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-rose-gold-dark text-right">
                  Free shipping on orders above ₹999
                </p>
              )}
            </div>

            <div className="flex justify-between items-center font-display text-3xl text-deep-brown mb-8">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button 
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-body uppercase tracking-widest text-sm py-4 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <MessageCircle size={18} className="mr-2" />
              Order via WhatsApp
            </button>
            <p className="text-xs text-center text-deep-brown/50 mt-4 leading-relaxed font-body">
              Clicking this will generate a pre-filled WhatsApp message outlining your order.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
