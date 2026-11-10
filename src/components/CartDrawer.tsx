import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, 
  CheckCircle, ShieldCheck, Sparkles, MessageCircle, Tag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    shippingFee, 
    discountAmount, 
    orderTotal, 
    settings,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    setIsCheckoutOpen,
    getWhatsAppOrderUrl
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = settings.freeShippingThreshold;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyCouponCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleDirectWhatsAppCart = () => {
    if (cart.length === 0) return;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    let msg = `✨ *LUMORA SKINCARE - SHOPPING BAG ORDER* ✨\n\n`;
    msg += `Hello Concierge, I would like to order directly from my bag:\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name} (x${item.quantity}) — Rs. ${(item.product.price * item.quantity).toLocaleString()}\n`;
    });
    msg += `\n*Subtotal:* Rs. ${subtotal.toLocaleString()}`;
    if (discountAmount > 0) msg += `\n*Discount Applied:* -Rs. ${discountAmount.toLocaleString()}`;
    msg += `\n*Delivery:* ${shippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingFee}`}`;
    msg += `\n*Estimated Total:* Rs. ${orderTotal.toLocaleString()}\n\n`;
    msg += `Please send me the delivery confirmation form!`;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
          
          {/* HEADER */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h3 className="text-xl font-serif text-stone-900">Your Vanity Bag</h3>
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono font-semibold">
                {cart.reduce((t, i) => t + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart drawer"
              className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE DELIVERY METER */}
          <div className="bg-[#F5EFEB] p-4 border-b border-stone-200 text-xs">
            {subtotal >= freeDeliveryThreshold ? (
              <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Unlocked: Complimentary Nationwide Express Delivery!</span>
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-stone-600 font-light">
                  Add <strong className="text-stone-900">Rs. {(freeDeliveryThreshold - subtotal).toLocaleString()}</strong> more to enjoy complimentary express delivery.
                </p>
                <div className="w-full bg-stone-300/80 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CART ITEMS SCROLLABLE LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-serif text-stone-800">Your bag is currently empty</h4>
                  <p className="text-xs text-stone-500 mt-1">Discover pure botanical elixirs crafted for your skin barrier.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-stone-800"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-stone-200 items-center shadow-xs"
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-stone-100 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">{item.product.category}</p>
                    <h4 className="text-xs font-serif font-medium text-stone-900 truncate">{item.product.name}</h4>
                    <p className="text-xs font-semibold text-stone-900 mt-0.5">
                      Rs. {item.product.price.toLocaleString()}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-stone-200 rounded bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-stone-200 rounded text-stone-700"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-stone-200 rounded text-stone-700"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] text-stone-500">
                        Total: Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-stone-300 hover:text-rose-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* FOOTER: PROMO CODE, TOTALS & CHECKOUT */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 space-y-4 bg-white">
              
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex justify-between items-center bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-amber-700" />
                      <span>{appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-stone-800 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Promo Code (LUMORA10, GLOW20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg uppercase tracking-wider focus:outline-none focus:border-stone-900"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-stone-800"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <p className={`text-[11px] mt-1 ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Order Calculation */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>VIP Privilege Discount</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Nationwide Courier Delivery</span>
                  <span>{shippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Payable Total</span>
                  <span>Rs. {orderTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#1A1815] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-semibold rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDirectWhatsAppCart}
                  className="w-full py-3 border border-emerald-700 text-emerald-800 bg-emerald-50/70 text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Quick Order via WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
