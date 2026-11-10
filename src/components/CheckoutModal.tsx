import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { 
  X, ShieldCheck, Lock, CheckCircle, CreditCard, 
  Building2, Phone, Truck, ArrowRight, MessageCircle, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  onOrderPlaced?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onOrderPlaced }) => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    subtotal, 
    shippingFee, 
    discountAmount, 
    orderTotal, 
    settings, 
    appliedCoupon,
    placeOrder, 
    getWhatsAppOrderUrl,
    showToast
  } = useStore();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  // Simulated Card Payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSuccessOrder, setIsSuccessOrder] = useState<any | null>(null);

  if (!isCheckoutOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      showToast('Please complete all required shipping fields.');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    // Card verification validation
    if (paymentMethod === 'Card') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 16) {
        showToast('Please enter a valid 16-digit debit or credit card number.');
        return;
      }
      if (!cardExpiry || !cardCvc) {
        showToast('Please enter card expiry date and CVV security code.');
        return;
      }

      setIsProcessingPayment(true);
      // Realistic payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsProcessingPayment(false);
    }

    const createdOrder = await placeOrder({
      customerName: name,
      phone,
      email,
      address,
      city,
      deliveryNotes,
      items: [...cart],
      subtotal,
      shipping: shippingFee,
      discount: discountAmount,
      total: orderTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending'
    });

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#1A1815', '#E8C5B8']
      });
    } catch {
      // ignore
    }

    setIsSuccessOrder(createdOrder);
    if (onOrderPlaced) {
      onOrderPlaced(createdOrder.id);
    }
  };

  const handleCompleteWhatsApp = () => {
    if (!isSuccessOrder) return;
    const url = getWhatsAppOrderUrl(isSuccessOrder);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">256-Bit Encrypted Protocol</span>
            </div>
            <h3 className="text-2xl font-serif text-stone-900 mt-0.5">Dispatched Checkout</h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close checkout form"
            className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {isSuccessOrder ? (
            /* ORDER CONFIRMATION VIEW */
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  Order Successfully Registered
                </span>
                <h3 className="text-3xl font-serif text-stone-900 mt-3">
                  Thank You, {isSuccessOrder.customerName}
                </h3>
                <p className="text-sm text-stone-600 font-light mt-1">
                  Your reference ID is <strong className="font-mono text-stone-900 font-bold">#{isSuccessOrder.id}</strong>
                </p>
              </div>

              <div className="max-w-md mx-auto bg-white p-5 rounded-2xl border border-stone-200 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Delivery To:</span>
                  <span className="font-medium text-stone-900">{isSuccessOrder.address}, {isSuccessOrder.city}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Payment Mode:</span>
                  <span className="font-medium text-stone-900">{isSuccessOrder.paymentMethod} ({isSuccessOrder.paymentStatus})</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Courier Partner:</span>
                  <span className="font-medium text-stone-900">{isSuccessOrder.courier} (Tracking: {isSuccessOrder.trackingNumber})</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1">
                  <span>Total Payable:</span>
                  <span>Rs. {isSuccessOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-3 pt-2">
                <button
                  onClick={handleCompleteWhatsApp}
                  className="w-full py-4 bg-[#25D366] text-white text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Send Order Manifest to Store WhatsApp</span>
                </button>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-medium rounded-xl hover:bg-stone-800"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT INPUT FORM */
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* 1. SHIPPING DESTINATION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-stone-800" />
                  <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900">
                    1. Client Shipping Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Full Name *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Ayesha Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Mobile Contact *</label>
                    <input 
                      type="tel"
                      required
                      placeholder="03XX XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Email Address</label>
                    <input 
                      type="email"
                      placeholder="For tracking receipt & manifest"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Destination City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                    >
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Abbottabad">Abbottabad</option>
                      <option value="Other">Other City / District</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Street Address, House/Apartment No. *</label>
                  <input 
                    type="text"
                    required
                    placeholder="House / Flat No., Street, Sector or Phase"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Courier Delivery Instructions (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Ring bell twice, deliver between 1 PM and 5 PM"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* 2. PAYMENT METHODS (PAKISTAN OPTIONS) */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-stone-800" />
                  <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900">
                    2. Select Payment Mode
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(
                    [
                      { id: 'COD', label: 'Cash On Delivery' },
                      { id: 'Bank Transfer', label: 'Bank Transfer' },
                      { id: 'Easypaisa', label: 'Easypaisa' },
                      { id: 'JazzCash', label: 'JazzCash' },
                      { id: 'Card', label: 'Debit / Credit' }
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        paymentMethod === m.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-stone-600'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Specific Payment Mode Details */}
                {paymentMethod === 'Bank Transfer' && (
                  <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <Building2 className="w-4 h-4 text-amber-700" />
                      <span>{settings.bankDetails.bankName}</span>
                    </div>
                    <p className="text-stone-700">Account Title: <strong>{settings.bankDetails.accountTitle}</strong></p>
                    <p className="text-stone-700">Account No: <strong>{settings.bankDetails.accountNumber}</strong></p>
                    <p className="text-stone-700 font-mono text-[11px]">IBAN: <strong>{settings.bankDetails.iban}</strong></p>
                    <p className="text-[11px] text-stone-500 italic">
                      After transfer, click WhatsApp Confirmation to send your transaction screenshot.
                    </p>
                  </div>
                )}

                {paymentMethod === 'Easypaisa' && (
                  <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs space-y-1">
                    <p className="font-bold text-stone-900">Easypaisa Mobile Wallet Transfer</p>
                    <p className="text-stone-700">Account Number: <strong>{settings.easypaisaNumber}</strong></p>
                    <p className="text-stone-700">Title: <strong>{settings.easypaisaTitle}</strong></p>
                    <p className="text-[11px] text-stone-500 italic mt-1">
                      Orders will be dispatched upon payment receipt verification.
                    </p>
                  </div>
                )}

                {paymentMethod === 'JazzCash' && (
                  <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs space-y-1">
                    <p className="font-bold text-stone-900">JazzCash Mobile Account</p>
                    <p className="text-stone-700">Account Number: <strong>{settings.jazzCashNumber}</strong></p>
                    <p className="text-stone-700">Title: <strong>{settings.jazzCashTitle}</strong></p>
                    <p className="text-[11px] text-stone-500 italic mt-1">
                      Orders will be dispatched upon payment receipt verification.
                    </p>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-3">
                    <p className="font-bold text-stone-900">Direct Visa / MasterCard / PayPak Gateway</p>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Card Number</label>
                      <input 
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                        className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-xs focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Expiry (MM/YY)</label>
                        <input 
                          type="text"
                          placeholder="08/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                          className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-xs focus:outline-none focus:border-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">CVV Code</label>
                        <input 
                          type="password"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          maxLength={4}
                          className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-xs focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Pay in cash directly to TCS/Trax courier agent upon physical doorstep delivery.</span>
                  </div>
                )}
              </div>

              {/* 3. ORDER SUMMARY */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({cart.reduce((t, i) => t + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount Promo</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Nationwide Express Delivery</span>
                  <span>{shippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Payable:</span>
                  <span>Rs. {orderTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-4 bg-[#1A1815] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>Verifying Transaction with Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm Order & Dispatch Protocol</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
