import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ThreeDShowcase } from './components/ThreeDShowcase';
import { CinematicVideoPlayer } from './components/CinematicVideoPlayer';
import { SkinQuizModal } from './components/SkinQuizModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Product } from './types';
import { 
  ShoppingBag, Heart, Shield, Sparkles, Star, ChevronRight, 
  Menu, X, Phone, CheckCircle, Truck, Package, RotateCcw, 
  Search, ArrowRight, Lock, MessageCircle, Mail, MapPin, 
  Instagram, Plus, Check, Droplets, Filter, HelpCircle,
  FileText, ShieldCheck, ChevronDown, Send
} from 'lucide-react';

function LumoraStorefront() {
  const { 
    products, 
    cart, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    cartCount,
    setIsCartOpen,
    selectedProduct,
    setSelectedProduct,
    setIsQuizOpen,
    settings,
    toastMessage,
    showToast,
    submitContactInquiry,
    subscribeNewsletter
  } = useStore();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'about' | 'contact' | 'faqs' | 'track' | 'reviews' | 'policies' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePolicyTab, setActivePolicyTab] = useState<'return' | 'privacy' | 'terms'>('return');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState('');
  const { orders } = useStore();
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);

  // 3D Model selected inside hero
  const [hero3DModel, setHero3DModel] = useState<'serum' | 'cream' | 'cleanser' | 'sunscreen'>('serum');

  // Handle Contact Form Submit to Firestore
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmittingContact(true);
    await submitContactInquiry({
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      message: contactMessage
    });
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
    setIsSubmittingContact(false);
  };

  // Handle Newsletter Submit to Firestore
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribing(true);
    await subscribeNewsletter(newsletterEmail);
    setNewsletterEmail('');
    setIsSubscribing(false);
  };

  // Filtered Products for Shop
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skinType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1815] font-sans antialiased selection:bg-[#EBDCD4] selection:text-[#1A1815]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1A1815] text-[#FAF7F2] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-amber-500/30 text-xs font-medium animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP LUXURY ANNOUNCEMENT TICKER */}
      {settings.isAnnouncementActive && (
        <div className="bg-[#12100E] text-[#E8D3C6] px-4 py-2 text-[11px] tracking-widest text-center font-light uppercase flex justify-center items-center gap-4 sm:gap-8 border-b border-stone-800">
          <span>✨ {settings.announcementText}</span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">Tested for South Asian UV Indices</span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden md:inline">Cash on Delivery Available</span>
        </div>
      )}

      {/* LUXURY MAIN NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-stone-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setActiveTab(activeTab === 'shop' ? 'home' : 'shop')}
              className="p-2 text-stone-700 hover:text-black"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links - Desktop Left */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-stone-700">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedCategory('All'); }}
              className={`hover:text-black transition-colors ${activeTab === 'home' ? 'text-black border-b border-black pb-1' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setActiveTab('shop'); setSelectedCategory('All'); }}
              className={`hover:text-black transition-colors ${activeTab === 'shop' && selectedCategory === 'All' ? 'text-black border-b border-black pb-1' : ''}`}
            >
              Shop All
            </button>
            <button 
              onClick={() => { setActiveTab('shop'); setSelectedCategory('Serums'); }}
              className={`hover:text-black transition-colors ${selectedCategory === 'Serums' ? 'text-black border-b border-black pb-1' : ''}`}
            >
              Serums
            </button>
            <button 
              onClick={() => { setActiveTab('shop'); setSelectedCategory('Bundles'); }}
              className={`hover:text-black transition-colors ${selectedCategory === 'Bundles' ? 'text-black border-b border-black pb-1' : ''}`}
            >
              Bundles
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`hover:text-black transition-colors ${activeTab === 'about' ? 'text-black border-b border-black pb-1' : ''}`}
            >
              The Maison
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`hover:text-black transition-colors ${activeTab === 'contact' ? 'text-black border-b border-black pb-1' : ''}`}
            >
              Concierge
            </button>
          </nav>

          {/* Central Luxury Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer text-center group"
          >
            <h1 className="text-2xl sm:text-3xl tracking-[0.25em] font-serif uppercase font-normal text-stone-900 group-hover:tracking-[0.3em] transition-all duration-300">
              LUMORA
            </h1>
            <p className="text-[9px] uppercase tracking-[0.35em] text-stone-500 font-light -mt-1">
              HAUTE SKINCARE
            </p>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-5 text-stone-800">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold uppercase tracking-wider hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Skin Quiz</span>
            </button>

            <button 
              onClick={() => setActiveTab('track')}
              className="hidden sm:flex items-center gap-1 text-xs uppercase tracking-wider text-stone-600 hover:text-black"
              title="Track Order"
            >
              <Truck className="w-4 h-4" />
              <span>Track</span>
            </button>

            {/* Admin Dashboard */}
            <button 
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded-full transition-colors ${activeTab === 'admin' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'}`}
              title="Executive Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Open Vanity Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1A1815] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 1. HOME VIEW (CINEMATIC 3D HERO + REEL + BESTSELLERS + QUIZ)    */}
      {/* ============================================================== */}
      {activeTab === 'home' && (
        <main>
          {/* CINEMATIC 3D HERO SECTION */}
          <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFEB] to-[#FAF7F2] py-10 lg:py-16 border-b border-stone-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Hero Storytelling */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200 shadow-xs text-xs uppercase tracking-widest text-stone-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Clinical Botanical Science • South Asian Barrier Care</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-950 tracking-tight leading-[1.12]">
                  The pure science of <br />
                  <span className="italic font-normal font-serif text-[#C59B6A]">unrivaled radiance.</span>
                </h1>

                <p className="text-sm sm:text-base text-stone-600 max-w-xl font-light leading-relaxed">
                  Infused with pharmaceutical-grade actives and organic Damask Rose steam-distillates. Formulated specifically to soothe, fortify, and illuminate skin under Pakistan's extreme UV and humidity.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                  <button 
                    onClick={() => { setActiveTab('shop'); setSelectedCategory('All'); }}
                    className="w-full sm:w-auto px-8 py-4 bg-[#1A1815] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-semibold rounded-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <span>Shop All Formulations</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => setIsQuizOpen(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-white border border-stone-300 text-stone-900 text-xs uppercase tracking-[0.2em] font-semibold rounded-lg hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Skin Routine Finder</span>
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/80 text-left">
                  <div>
                    <p className="text-2xl font-serif font-semibold text-stone-900">100%</p>
                    <p className="text-[11px] uppercase tracking-wider text-stone-500">Paraben & Sulfate Free</p>
                  </div>
                  <div>
                    <p className="text-2xl font-serif font-semibold text-stone-900">14 Days</p>
                    <p className="text-[11px] uppercase tracking-wider text-stone-500">Visible Glow Transformation</p>
                  </div>
                  <div>
                    <p className="text-2xl font-serif font-semibold text-stone-900">4.9 ★</p>
                    <p className="text-[11px] uppercase tracking-wider text-stone-500">3,500+ Verified Reviews</p>
                  </div>
                </div>
              </div>

              {/* Right: Three.js 3D Product Interactive Canvas */}
              <div className="lg:col-span-6 w-full relative">
                <ThreeDShowcase 
                  initialProductType={hero3DModel}
                  onSelectProduct={(type) => setHero3DModel(type)}
                />
              </div>

            </div>
          </section>

          {/* 10-15s CINEMATIC SKINCARE PROMOTIONAL VIDEO SHOWCASE */}
          <section className="py-20 bg-[#12100E] text-[#FAF7F2] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                  Cinematic Formulation Showcase
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif font-light text-white leading-tight">
                  Where Ancient Botanics Meet Modern Molecular Biology
                </h2>
                <p className="text-stone-300 text-xs sm:text-sm font-light max-w-xl mx-auto">
                  Experience the 15-second cinematic masterclass showcasing our pure extraction standards, cold-pressed actives, and 72-hour moisture barriers.
                </p>
              </div>

              {/* Video Player */}
              <div className="max-w-5xl mx-auto">
                <CinematicVideoPlayer 
                  onShopClick={() => { setActiveTab('shop'); setSelectedCategory('Bundles'); }}
                />
              </div>

            </div>
          </section>

          {/* FEATURED BESTSELLERS SHOWCASE */}
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">The Dispensary</span>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900 mt-1">Iconic Formulations</h2>
              </div>
              <button 
                onClick={() => { setActiveTab('shop'); setSelectedCategory('All'); }}
                className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-amber-700 flex items-center gap-2 group"
              >
                <span>Discover All Formulations</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.filter(p => p.isFeatured).slice(0, 6).map((product) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div 
                    className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" 
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-[#1A1815] text-white text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-sm shadow-md">
                      SAVE Rs. {(product.originalPrice - product.price).toLocaleString()}
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      aria-label="Save to wishlist"
                      className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-stone-700 hover:text-rose-600 transition-colors shadow-xs"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <span className="uppercase tracking-widest font-semibold text-amber-800">{product.category}</span>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-semibold text-stone-900">{product.rating}</span>
                          <span className="text-stone-400">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        className="text-lg font-serif font-medium text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer mt-1"
                      >
                        {product.name}
                      </h3>
                      
                      <p className="text-xs text-stone-500 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 line-through mr-2">Rs. {product.originalPrice.toLocaleString()}</span>
                        <span className="text-base font-bold text-stone-900">Rs. {product.price.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            setIsCartOpen(true);
                          }}
                          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Buy Now
                        </button>
                        <button 
                          onClick={() => addToCart(product, 1)}
                          className="p-2 bg-[#1A1815] text-white rounded-lg hover:bg-stone-800 transition-colors"
                          title="Add to Vanity Bag"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SKIN ROUTINE QUIZ PROMO BANNER */}
          <section className="bg-gradient-to-r from-[#F5EFEB] via-[#EFE8DE] to-[#F5EFEB] py-16 border-y border-stone-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">Complimentary Consultation</span>
              <h3 className="text-3xl sm:text-4xl font-serif font-light text-stone-900">
                Not certain which formulation matches your skin barrier?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-light leading-relaxed">
                Take our 3-step diagnostic concierge quiz to receive an exact clinical protocol tailored for your skin type and concerns.
              </p>
              <button 
                onClick={() => setIsQuizOpen(true)}
                className="mt-2 px-8 py-3.5 bg-[#1A1815] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-stone-800 transition-all inline-flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Begin Skin Diagnostic Quiz</span>
              </button>
            </div>
          </section>

          {/* BRAND PILLARS */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-8 h-8 text-stone-900 mb-3" />
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900">Nationwide Express</h4>
              <p className="text-xs text-stone-500 font-light mt-1">Dispatched via TCS & Trax in 48 to 72 hours</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-stone-900 mb-3" />
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900">Direct From Lab</h4>
              <p className="text-xs text-stone-500 font-light mt-1">100% authentic dermatologically verified formulas</p>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-8 h-8 text-stone-900 mb-3" />
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900">7-Day Guarantee</h4>
              <p className="text-xs text-stone-500 font-light mt-1">Full replacement on transit damage or sensitivity</p>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-stone-900 mb-3" />
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900">Skincare Concierge</h4>
              <p className="text-xs text-stone-500 font-light mt-1">Personalized routine advice on WhatsApp</p>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================== */}
      {/* 2. SHOP ALL & CATEGORIES                                       */}
      {/* ============================================================== */}
      {activeTab === 'shop' && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">The Dispensary</span>
            <h2 className="text-4xl font-serif font-light text-stone-900 mt-1">Botanical Formulations</h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light mt-2">Filter elixirs targeted for your specific skin concerns.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-200">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {['All', 'Serums', 'Moisturizers', 'Cleansers', 'Sunscreens', 'Toners', 'Bundles'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#1A1815] text-white shadow-md'
                      : 'bg-white border border-stone-300 text-stone-700 hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search active, vitamin, acid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-stone-300 rounded-full focus:outline-none focus:border-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div 
                  className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" 
                  onClick={() => setSelectedProduct(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3 bg-[#1A1815] text-white text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-sm shadow-md">
                    SAVE Rs. {(product.originalPrice - product.price).toLocaleString()}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    aria-label="Save to wishlist"
                    className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-stone-700 hover:text-rose-600 transition-colors shadow-xs"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="uppercase tracking-widest font-semibold text-amber-800">{product.category}</span>
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-semibold text-stone-900">{product.rating}</span>
                        <span className="text-stone-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="text-lg font-serif font-medium text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer mt-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 line-through mr-2">Rs. {product.originalPrice.toLocaleString()}</span>
                      <span className="text-base font-bold text-stone-900">Rs. {product.price.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          setIsCartOpen(true);
                        }}
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                      >
                        Buy Now
                      </button>
                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="p-2 bg-[#1A1815] text-white rounded-lg hover:bg-stone-800 transition-colors"
                        title="Add to Vanity Bag"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 3. ORDER SHIPMENT TRACKING                                     */}
      {/* ============================================================== */}
      {activeTab === 'track' && (
        <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <Package className="w-12 h-12 text-stone-800 mx-auto" />
            <h2 className="text-3xl font-serif text-stone-900">Track Your Shipment</h2>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              Enter your LMR Order Reference ID (e.g. LMR-948210)
            </p>
          </div>

          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="e.g. LMR-948210 or your contact phone"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-stone-900"
            />
            <button
              onClick={() => {
                const q = trackQuery.trim().toLowerCase();
                const found = orders.find(o => 
                  o.id.toLowerCase() === q ||
                  o.phone.includes(q)
                );
                if (found) {
                  setSearchedOrder(found);
                } else {
                  showToast('No record found with that Reference ID.');
                }
              }}
              className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-stone-800"
            >
              Verify Tracking
            </button>
          </div>

          {searchedOrder && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Order Reference</span>
                  <h3 className="text-xl font-bold font-serif text-stone-900">#{searchedOrder.id}</h3>
                  <p className="text-xs text-stone-500">{searchedOrder.createdAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    searchedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    searchedOrder.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {searchedOrder.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">✓</div>
                  <p className="text-[11px] font-semibold uppercase text-stone-800">Order Confirmed</p>
                </div>
                <div className="space-y-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                    searchedOrder.status === 'Dispatched' || searchedOrder.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {searchedOrder.status === 'Dispatched' || searchedOrder.status === 'Delivered' ? '✓' : '2'}
                  </div>
                  <p className="text-[11px] font-semibold uppercase text-stone-800">In Courier Transit</p>
                </div>
                <div className="space-y-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                    searchedOrder.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {searchedOrder.status === 'Delivered' ? '✓' : '3'}
                  </div>
                  <p className="text-[11px] font-semibold uppercase text-stone-800">Delivered</p>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Customer Destination:</span>
                  <span className="font-semibold text-stone-900">{searchedOrder.customerName} — {searchedOrder.address}, {searchedOrder.city}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Courier Manifest:</span>
                  <span className="font-semibold text-stone-900">{searchedOrder.courier || 'TCS Express'} (Tracking: {searchedOrder.trackingNumber || 'Pending'})</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Payable Mode:</span>
                  <span className="font-semibold text-stone-900">{searchedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Payable Total:</span>
                  <span>Rs. {searchedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================================================== */}
      {/* 4. ABOUT THE MAISON                                            */}
      {/* ============================================================== */}
      {activeTab === 'about' && (
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C59B6A] font-semibold">The Lumora Heritage</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-stone-950">Botanical Purity, Clinical Efficacy</h2>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-stone-200">
            <img 
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1400" 
              alt="Lumora Skincare Laboratory" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6 text-sm text-stone-700 font-light leading-relaxed">
            <p>
              Founded with the conviction that luxury skincare should be engineered with clinical potency for South Asian skin barriers, LUMORA SKINCARE synthesizes high-altitude organic botanicals with verified dermatological actives.
            </p>
            <p>
              Unlike generic formulas designed for temperate European climates, our lipid complexes, antioxidants, and water-gel shields are tested in Pakistan's high humidity and intense UV indexes. We replace cheap filler water with steam-distilled Rosa Damascena petal distillates harvested at dawn.
            </p>
            <p>
              Every glass vessel is crafted from medical-grade borosilicate, ensuring maximum photostability for active compounds like pure L-Ascorbic Acid, Niacinamide, and Peptides without artificial synthetic preservatives.
            </p>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 5. CONCIERGE & CONTACT (CONNECTED TO FIRESTORE)                */}
      {/* ============================================================== */}
      {activeTab === 'contact' && (
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C59B6A] font-semibold">Client Care</span>
            <h2 className="text-4xl font-serif font-light text-stone-900">Lumora Concierge Desk</h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light">Direct communication with our skincare specialists and order coordinators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Form connected to Firestore */}
            <form onSubmit={handleContactSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-serif text-stone-900">Send an Inquiry</h3>
              
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Your Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="Full Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Email *</label>
                  <input 
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Phone</label>
                  <input 
                    type="tel"
                    placeholder="0300 XXXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">Message / Consultation Details *</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Inquire about ingredients, routine guidance, or corporate gifting..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingContact}
                className="w-full py-3.5 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingContact ? 'Transmitting to Concierge...' : 'Submit Message'}</span>
              </button>
            </form>

            {/* Direct Channels */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <span>WhatsApp VIP Order & Inquiry Line</span>
                  </div>
                  <p className="text-xs text-stone-500 font-light">
                    Direct instant chat with our certified skincare coordinators.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Lumora Concierge, I would like to consult regarding product formulations.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                  >
                    <span>Chat on WhatsApp: {settings.whatsappNumber}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                    <MapPin className="w-5 h-5 text-amber-700" />
                    <span>Flagship Lounges</span>
                  </div>
                  <p>• <strong>Karachi:</strong> Suite 402, Ocean Mall, Block 9, Clifton</p>
                  <p>• <strong>Lahore:</strong> 18-C, Gulberg III, MM Alam Road</p>
                  <p>• <strong>Islamabad:</strong> Beverly Centre, Blue Area</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 6. FAQS ACCORDION                                              */}
      {/* ============================================================== */}
      {activeTab === 'faqs' && (
        <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <HelpCircle className="w-10 h-10 text-stone-800 mx-auto" />
            <h2 className="text-3xl font-serif text-stone-900">Frequently Inquired Topics</h2>
          </div>

          <div className="space-y-4 text-xs">
            {[
              {
                q: 'Are Lumora formulations compatible with sensitive Pakistani skin?',
                a: 'Yes. Every formula is dermatologist-screened, non-comedogenic, and 100% free from drying alcohol, artificial perfumes, and parabens. Our clinical tests are conducted on South Asian Fitzpatrick types III–V.'
              },
              {
                q: 'How long does nationwide delivery take?',
                a: 'Orders placed before 3:00 PM are packaged the same day. Deliveries to Karachi, Lahore, and Islamabad take 24–48 hours. Other cities take 48–72 hours via TCS Express and Trax Logistics.'
              },
              {
                q: 'Does your SPF 50 sunscreen leave any white or purple cast?',
                a: 'Guaranteed 100% transparent. Our SPF 50 uses modern high-stability European organic filters formulated in an ultra-light water gel that dries down completely clear on all skin tones with zero flashback.'
              },
              {
                q: 'What is your 7-Day Guarantee and Return Protocol?',
                a: 'If your product arrives damaged in courier transit or causes barrier irritation within 7 days of delivery, contact our WhatsApp Concierge for an immediate complimentary replacement or full refund.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-semibold text-stone-900 text-sm">{faq.q}</h4>
                <p className="text-stone-600 font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 7. EXECUTIVE ADMIN DASHBOARD (CONNECTED TO FIREBASE)           */}
      {/* ============================================================== */}
      {activeTab === 'admin' && (
        <AdminDashboard />
      )}

      {/* ============================================================== */}
      {/* FLOATING DIRECT WHATSAPP ORDERING ICON                         */}
      {/* ============================================================== */}
      <a 
        href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Lumora Concierge, I would like to inquire about skincare routine availability and ordering.')}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Direct WhatsApp Concierge"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-white/60"
      >
        <Phone className="w-6 h-6 fill-white" />
      </a>

      {/* SLIDE-OVER CART DRAWER */}
      <CartDrawer />

      {/* CHECKOUT MODAL (PAKISTAN PAYMENT FLOW) */}
      <CheckoutModal 
        onOrderPlaced={(orderId) => {
          setActiveTab('track');
          setTrackQuery(orderId);
        }}
      />

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpen3DView={(type) => {
            setHero3DModel(type);
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* SKIN DIAGNOSTIC QUIZ MODAL */}
      <SkinQuizModal />

      {/* LUXURY EDITORIAL FOOTER */}
      <footer className="bg-[#12100E] text-[#FAF7F2] pt-16 pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <h4 className="text-2xl font-serif tracking-[0.25em] uppercase text-white">LUMORA</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Haute botanical skincare formulated for the resilience and luminescence of South Asian skin barriers.
            </p>
            <p className="text-xs text-stone-500">Concierge Desk: {settings.storeEmail}</p>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37] mb-4">Formulations</h5>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('shop'); setSelectedCategory('Serums'); }}>Glow Serums</li>
              <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('shop'); setSelectedCategory('Moisturizers'); }}>Barrier Creams</li>
              <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('shop'); setSelectedCategory('Cleansers'); }}>Amino Cloud Cleansers</li>
              <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('shop'); setSelectedCategory('Sunscreens'); }}>Zero Cast SPF 50</li>
              <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('shop'); setSelectedCategory('Bundles'); }}>Haute Bundles</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37] mb-4">Client Relations</h5>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('track')}>Track Shipment</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setIsQuizOpen(true)}>Skin Diagnostic Quiz</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('faqs')}>Frequently Asked Questions</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('contact')}>Flagship Lounges</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('admin')}>Executive Portal</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">The Lumora Journal</h5>
            <p className="text-xs text-stone-400 font-light">
              Join our private clientele list for confidential seasonal releases and exclusive private offers.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email"
                required
                placeholder="Enter client email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white flex-1 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-4 py-2.5 bg-[#D4AF37] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-300 transition-colors"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 font-light">
          <p>© 2026 LUMORA SKINCARE HAUTE PVT LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Karachi</span>
            <span>•</span>
            <span>Lahore</span>
            <span>•</span>
            <span>Islamabad</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <LumoraStorefront />
    </StoreProvider>
  );
}
