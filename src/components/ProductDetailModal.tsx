import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  X, Star, Heart, ShoppingBag, Plus, Minus, Check, 
  ShieldCheck, Droplets, Sparkles, MessageCircle, Share2, 
  ArrowRight, Box
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpen3DView?: (type: 'serum' | 'cream' | 'cleanser' | 'sunscreen') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose,
  onOpen3DView
}) => {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen, settings, addReview, products, setSelectedProduct } = useStore();
  
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howToUse' | 'reviews'>('benefits');
  const [activeImage, setActiveImage] = useState<string>(product.image);

  // New review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('Karachi');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newSkinType, setNewSkinType] = useState('Combination');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isFavorited = wishlist.includes(product.id);
  const discountVal = product.originalPrice - product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  const handleWhatsAppInquiry = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = `Hello Lumora Concierge, I am interested in inquiring about the *${product.name}* (Rs. ${product.price.toLocaleString()}). Is it currently in stock for immediate dispatch?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;
    addReview(product.id, {
      author: newAuthor,
      city: newCity,
      rating: newRating,
      comment: newComment,
      verifiedPurchase: true,
      skinType: newSkinType
    });
    setNewAuthor('');
    setNewComment('');
    setShowReviewForm(false);
  };

  // Related products from same or complimentary category
  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF7F2] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close formulation details"
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 rounded-full hover:bg-stone-900 hover:text-white transition-all shadow-md text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: GALLERY & 3D SWITCH */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
                <img 
                  src={activeImage} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Discount Badge */}
                {discountVal > 0 && (
                  <div className="absolute top-4 left-4 bg-[#1A1815] text-[#FAF7F2] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-sm shadow-md">
                    SAVE Rs. {discountVal.toLocaleString()}
                  </div>
                )}

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist toggle"
                  className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full hover:bg-white text-stone-800 transition-colors shadow-sm"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>

                {/* 3D Model Inspector Trigger */}
                {onOpen3DView && (
                  <button
                    onClick={() => {
                      onOpen3DView(product.model3DType);
                      onClose();
                    }}
                    className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-stone-900 border border-stone-300 shadow-md hover:bg-stone-900 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Box className="w-3.5 h-3.5 text-amber-600" />
                    <span>Launch 3D WebGL Model</span>
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveImage(product.image)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === product.image ? 'border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </button>
                {product.secondaryImage && (
                  <button 
                    onClick={() => setActiveImage(product.secondaryImage!)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === product.secondaryImage ? 'border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={product.secondaryImage} alt="Application Texture" className="w-full h-full object-cover" />
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/80 text-center">
                <div className="p-2 rounded bg-stone-100/70">
                  <ShieldCheck className="w-4 h-4 text-stone-800 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">Dermatologist Verified</p>
                </div>
                <div className="p-2 rounded bg-stone-100/70">
                  <Droplets className="w-4 h-4 text-stone-800 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">Non-Comedogenic</p>
                </div>
                <div className="p-2 rounded bg-stone-100/70">
                  <Sparkles className="w-4 h-4 text-stone-800 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">South Asian Climate Safe</p>
                </div>
              </div>
            </div>

            {/* RIGHT: DETAILS, PRICING, ACTIONS & REVIEWS */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="uppercase tracking-[0.2em] font-semibold text-amber-800">{product.category}</span>
                  <span className="font-mono text-stone-400 text-[11px]">{product.sku}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-950">{product.name}</h2>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center text-amber-500">
                    {'★'.repeat(Math.floor(product.rating))}
                    <span className="text-xs font-bold text-stone-900 ml-1.5">{product.rating}</span>
                  </div>
                  <span className="text-stone-300">•</span>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-stone-500 hover:text-stone-900 underline font-medium"
                  >
                    {product.reviewsCount} Verified Reviews
                  </button>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-emerald-700 font-semibold">{product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}</span>
                </div>

                {/* Price block */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-semibold text-stone-900">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-base text-stone-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>

                <p className="text-xs text-stone-500 mt-1 font-light">
                  Size: <strong className="text-stone-800">{product.size}</strong> | Ideal For: <strong className="text-stone-800">{product.skinType}</strong>
                </p>

                <p className="text-xs sm:text-sm text-stone-600 font-light mt-4 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity & Buy Buttons */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-mono font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag — Rs. {(product.price * quantity).toLocaleString()}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleBuyNow}
                    className="py-3 bg-amber-700 text-white rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-amber-800 transition-colors"
                  >
                    Instant Buy Now
                  </button>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="py-3 border border-emerald-700 text-emerald-800 bg-emerald-50/60 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>WhatsApp Inquiry</span>
                  </button>
                </div>
              </div>

              {/* TABS: BENEFITS / INGREDIENTS / RITUAL / REVIEWS */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex border-b border-stone-200 text-xs">
                  {[
                    { id: 'benefits', label: 'Clinical Benefits' },
                    { id: 'ingredients', label: 'Ingredients Matrix' },
                    { id: 'howToUse', label: 'Application Ritual' },
                    { id: 'reviews', label: `Reviews (${product.reviewsCount})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`pb-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] transition-colors ${
                        activeTab === tab.id
                          ? 'border-b-2 border-stone-900 text-stone-900'
                          : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="pt-4 text-xs text-stone-600 leading-relaxed min-h-[140px]">
                  {activeTab === 'benefits' && (
                    <ul className="space-y-2">
                      {product.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'ingredients' && (
                    <div className="space-y-3">
                      <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Active Molecular Matrix:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients.map((ing, i) => (
                          <span key={i} className="px-2.5 py-1 bg-stone-200/70 text-stone-800 rounded text-[11px]">
                            {ing}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-stone-400 font-light mt-2">
                        Formulated without parabens, phthalates, synthetic fragrance, animal derivatives, or mineral oils.
                      </p>
                    </div>
                  )}

                  {activeTab === 'howToUse' && (
                    <div className="space-y-2">
                      <p className="font-medium text-stone-800">The Lumora Recommended Ritual:</p>
                      <p>{product.howToUse}</p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                        <div>
                          <span className="font-bold text-stone-900 text-sm">{product.rating} / 5.0</span>
                          <span className="text-stone-400 text-xs ml-2">({product.reviewsCount} reviews)</span>
                        </div>
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="px-3 py-1 bg-stone-900 text-white rounded text-[11px] uppercase font-semibold"
                        >
                          {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                      </div>

                      {showReviewForm && (
                        <form onSubmit={handleSubmitReview} className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                          <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">Leave Verified Client Feedback</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Your Name"
                              value={newAuthor}
                              onChange={(e) => setNewAuthor(e.target.value)}
                              className="px-2.5 py-1.5 border border-stone-300 rounded text-xs"
                            />
                            <input
                              type="text"
                              placeholder="City (e.g. Lahore, Karachi)"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              className="px-2.5 py-1.5 border border-stone-300 rounded text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-stone-600 font-medium">Rating:</span>
                            <div className="flex gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((st) => (
                                <button
                                  type="button"
                                  key={st}
                                  onClick={() => setNewRating(st)}
                                  className="text-base"
                                >
                                  {st <= newRating ? '★' : '☆'}
                                </button>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Skin Type (e.g. Dry, Oily)"
                              value={newSkinType}
                              onChange={(e) => setNewSkinType(e.target.value)}
                              className="flex-1 px-2.5 py-1 border border-stone-300 rounded text-xs"
                            />
                          </div>
                          <textarea
                            required
                            rows={2}
                            placeholder="Share your experience with texture, results, and South Asian climate wear..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs"
                          />
                          <button
                            type="submit"
                            className="w-full py-2 bg-stone-900 text-white rounded text-xs uppercase font-semibold"
                          >
                            Submit Verified Feedback
                          </button>
                        </form>
                      )}

                      {/* Existing Reviews */}
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {product.reviews && product.reviews.length > 0 ? (
                          product.reviews.map((rev) => (
                            <div key={rev.id} className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="font-semibold text-stone-900">{rev.author} • {rev.city}</span>
                                <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                              </div>
                              <p className="text-stone-600 text-xs font-light">{rev.comment}</p>
                              <div className="flex gap-2 text-[10px] text-stone-400">
                                <span>{rev.date}</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-medium">✓ Verified Client</span>
                                {rev.skinType && <span>• {rev.skinType}</span>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-stone-400 italic">No customer reviews yet. Be the first to share your experience!</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Formulations Recommendations */}
              <div className="pt-4 border-t border-stone-200">
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Pairs Synergistically With:</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {related.map((rel) => (
                    <div 
                      key={rel.id} 
                      onClick={() => setSelectedProduct(rel)}
                      className="p-2 bg-white rounded-lg border border-stone-200 hover:border-stone-800 cursor-pointer transition-all flex flex-col items-center text-center group"
                    >
                      <img src={rel.image} alt={rel.name} className="w-12 h-12 object-cover rounded mb-1" />
                      <p className="text-[11px] font-medium text-stone-900 line-clamp-1 group-hover:text-amber-800">{rel.name}</p>
                      <p className="text-[10px] font-bold text-stone-700">Rs. {rel.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
