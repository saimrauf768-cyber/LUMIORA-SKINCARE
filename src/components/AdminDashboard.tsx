import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Coupon, StoreSettings } from '../types';
import { 
  Lock, TrendingUp, Package, Users, Tag, Settings, 
  Plus, Edit2, Trash2, CheckCircle, Clock, Truck, 
  DollarSign, Sparkles, AlertCircle, Save, ExternalLink,
  ShieldCheck, LogIn, LogOut, Database, RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    coupons, 
    settings, 
    updateProduct, 
    addProduct, 
    deleteProduct, 
    updateOrderStatus, 
    updateSettings, 
    addCoupon, 
    toggleCouponActive,
    currentUser,
    isAdmin,
    loginAdminWithGoogle,
    logoutAdmin,
    showToast
  } = useStore();

  const [passcode, setPasscode] = useState<string>('');
  const [passcodeUnlocked, setPasscodeUnlocked] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'pricing' | 'orders' | 'coupons' | 'settings'>('analytics');

  // Product Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // New Coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(2000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Editable settings state
  const [editableSettings, setEditableSettings] = useState<StoreSettings>({ ...settings });

  // Handle Passcode Fallback
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'lumora2026' || passcode === 'admin') {
      setPasscodeUnlocked(true);
      showToast('Master Administrative Passcode verified.');
    } else {
      showToast('Access Denied: Invalid Security Passcode.');
    }
  };

  // Check if authenticated either through Firebase Auth or Master Passcode
  const isAuthorized = isAdmin || passcodeUnlocked || (currentUser && currentUser.email === 'saimrauf768@gmail.com');

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const activeOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Dispatched').length;
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // New Product Draft
  const emptyProduct: Product = {
    id: `prod-${Date.now()}`,
    sku: `LMR-NEW-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    category: 'Serums',
    price: 1299,
    originalPrice: 1699,
    stock: 50,
    size: '30 ml / 1.0 fl oz',
    skinType: 'All Skin Types',
    description: '',
    ingredients: ['Pure Botanical Actives'],
    benefits: ['Clinical luminescence and barrier restoration'],
    howToUse: 'Dispense 3-4 drops and pat gently into skin.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=900',
    rating: 5.0,
    reviewsCount: 1,
    isFeatured: true,
    model3DType: 'serum'
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-stone-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-[#1A1815] rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Firebase Cloud Security Gate
          </span>
          <h3 className="text-2xl font-serif text-stone-900 mt-2">Executive Admin Portal</h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Authenticated access for authorized store directors. Connects directly to Cloud Firestore & Firebase Auth.
          </p>
        </div>

        {/* PRIMARY: GOOGLE FIREBASE AUTHENTICATION */}
        <div className="space-y-3 pt-2">
          <button
            onClick={loginAdminWithGoogle}
            className="w-full py-3.5 px-4 bg-white border border-stone-300 rounded-xl text-xs uppercase tracking-wider font-semibold text-stone-800 hover:bg-stone-50 transition-all flex items-center justify-center gap-3 shadow-xs hover:border-stone-800"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google Admin</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-[10px] uppercase font-bold text-stone-400">or master passcode</span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>
        </div>

        {/* SECONDARY: MASTER PASSCODE */}
        <form onSubmit={handlePasscodeLogin} className="space-y-3">
          <input 
            type="password"
            placeholder="Security Passcode (lumora2026)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-xl text-center font-mono text-xs tracking-widest focus:outline-none focus:border-stone-900"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#1A1815] text-[#FAF7F2] rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors"
          >
            Authenticate Session
          </button>
        </form>

        <p className="text-[11px] text-stone-400 font-light">
          Authorized owner email: <strong className="text-stone-700">saimrauf768@gmail.com</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* TOP COMMAND BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">
              Cloud Firestore & Firebase Auth Connected
            </span>
          </div>
          <h2 className="text-3xl font-serif font-normal text-stone-900 mt-0.5">Lumora Management Console</h2>
          {currentUser && (
            <p className="text-xs text-stone-500 mt-0.5">
              Active Admin: <strong className="text-stone-900">{currentUser.email}</strong> • UID: <span className="font-mono text-[10px] text-stone-400">{currentUser.uid.substring(0, 10)}...</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 hidden sm:inline">
            WhatsApp Line: <strong className="text-stone-900 font-mono">{settings.whatsappNumber}</strong>
          </span>
          
          <button
            onClick={() => {
              if (currentUser) {
                logoutAdmin();
              }
              setPasscodeUnlocked(false);
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-xs uppercase font-semibold text-stone-800 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* ADMIN TABS NAVIGATION */}
      <div className="flex border-b border-stone-200 gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {[
          { id: 'analytics', label: '1. Executive Analytics', icon: TrendingUp },
          { id: 'pricing', label: '2. Pricing & Catalog Matrix', icon: DollarSign },
          { id: 'orders', label: '3. Orders & Courier Pipeline', icon: Truck },
          { id: 'coupons', label: '4. Promo Discount Engine', icon: Tag },
          { id: 'settings', label: '5. Brand & WhatsApp Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
              className={`flex items-center gap-2 py-3 px-4 font-semibold uppercase tracking-wider rounded-t-lg transition-all whitespace-nowrap ${
                activeAdminTab === tab.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 1. EXECUTIVE ANALYTICS                                         */}
      {/* ============================================================== */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total Net Revenue</span>
              <p className="text-3xl font-serif font-semibold text-stone-900 mt-2">
                Rs. {totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ Synced from Cloud Firestore</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Active Shipments</span>
              <p className="text-3xl font-serif font-semibold text-stone-900 mt-2">
                {activeOrdersCount} Orders
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-1">Pending TCS / Trax pickup</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Average Order Value (AOV)</span>
              <p className="text-3xl font-serif font-semibold text-stone-900 mt-2">
                Rs. {averageOrderValue.toLocaleString()}
              </p>
              <p className="text-[11px] text-stone-500 font-medium mt-1">Target benchmark: Rs. 2,800</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Warehouse Inventory</span>
              <p className="text-3xl font-serif font-semibold text-stone-900 mt-2">
                {products.reduce((s, p) => s + p.stock, 0)} Units
              </p>
              <p className="text-[11px] text-stone-500 font-medium mt-1">{products.length} registered SKUs</p>
            </div>
          </div>

          {/* Cloud Firestore Infrastructure Status Card */}
          <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-xl">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-950">Cloud Firestore Database Status: Healthy</h4>
                <p className="text-xs text-emerald-800 font-light mt-0.5">
                  Database ID: <strong>ai-studio-lumoraskincareha-92bafa39-b7e4-4c17-8f9d-763919306c98</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Real-Time Snapshots Active
              </span>
            </div>
          </div>

          {/* Quick fulfillment queue */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-lg font-serif text-stone-900">Recent Customer Inflow</h3>
            <div className="divide-y divide-stone-100 text-xs">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <span className="font-mono font-bold text-stone-900 mr-2">#{ord.id}</span>
                    <span className="font-medium text-stone-800">{ord.customerName} ({ord.city})</span>
                    <span className="text-stone-400 ml-2">• {ord.items.length} item(s)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-stone-900">Rs. {ord.total.toLocaleString()}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PRICING & CATALOG MATRIX (EDIT PRICES IN PKR)               */}
      {/* ============================================================== */}
      {activeAdminTab === 'pricing' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif text-stone-900">Formulations & Dynamic Pricing Matrix</h3>
              <p className="text-xs text-stone-500">Every price in PKR is synced directly to Cloud Firestore.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(emptyProduct);
                setIsAddingNew(true);
              }}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 flex items-center gap-1.5 self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Formulation</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-bold">
                    <th className="p-4">SKU / Formulation</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Retail Price (PKR)</th>
                    <th className="p-4">Original (PKR)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">3D Asset</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-stone-100 shrink-0" />
                        <div>
                          <p className="font-semibold text-stone-900">{p.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">{p.sku}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {p.category}
                        </span>
                      </td>

                      {/* Live editable Retail Price in Firestore */}
                      <td className="p-4 font-bold text-stone-900">
                        <input 
                          type="number"
                          value={p.price}
                          onChange={(e) => {
                            updateProduct({ ...p, price: Number(e.target.value) });
                          }}
                          className="w-24 px-2 py-1 border border-stone-300 rounded font-bold text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </td>

                      {/* Live editable Original Price */}
                      <td className="p-4 text-stone-400">
                        <input 
                          type="number"
                          value={p.originalPrice}
                          onChange={(e) => {
                            updateProduct({ ...p, originalPrice: Number(e.target.value) });
                          }}
                          className="w-24 px-2 py-1 border border-stone-200 rounded text-stone-500 focus:outline-none focus:border-stone-900"
                        />
                      </td>

                      {/* Live editable Stock */}
                      <td className="p-4">
                        <input 
                          type="number"
                          value={p.stock}
                          onChange={(e) => {
                            updateProduct({ ...p, stock: Number(e.target.value) });
                          }}
                          className={`w-16 px-2 py-1 border rounded font-mono text-xs ${
                            p.stock <= 10 ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-stone-200 text-stone-800'
                          }`}
                        />
                      </td>

                      <td className="p-4 font-mono text-[11px] text-stone-600">
                        {p.model3DType}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsAddingNew(false);
                            }}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                            title="Edit Full Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-stone-300 hover:text-rose-600 hover:bg-stone-100 rounded"
                            title="Delete Formulation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT / ADD MODAL */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                  <h3 className="text-xl font-serif text-stone-900">
                    {isAddingNew ? 'Create New Formulation' : `Edit: ${editingProduct.name}`}
                  </h3>
                  <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-900">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Product Name</label>
                    <input 
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      >
                        <option value="Serums">Serums</option>
                        <option value="Moisturizers">Moisturizers</option>
                        <option value="Cleansers">Cleansers</option>
                        <option value="Sunscreens">Sunscreens</option>
                        <option value="Toners">Toners</option>
                        <option value="Bundles">Bundles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">3D WebGL Model Type</label>
                      <select
                        value={editingProduct.model3DType}
                        onChange={(e) => setEditingProduct({ ...editingProduct, model3DType: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      >
                        <option value="serum">Serum Dropper Flacon</option>
                        <option value="cream">Luxury Cream Jar</option>
                        <option value="cleanser">Foaming Pump Bottle</option>
                        <option value="sunscreen">Sunscreen Shield Tube</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Price (PKR)</label>
                      <input 
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Original Price (PKR)</label>
                      <input 
                        type="number"
                        value={editingProduct.originalPrice}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Stock</label>
                      <input 
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                    <input 
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Description</label>
                    <textarea 
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={async () => {
                      if (isAddingNew) {
                        await addProduct(editingProduct);
                      } else {
                        await updateProduct(editingProduct);
                      }
                      setEditingProduct(null);
                    }}
                    className="flex-1 py-3 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-stone-800"
                  >
                    Save to Firestore
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-6 py-3 border border-stone-300 rounded-lg text-xs uppercase font-medium hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ORDERS & COURIER PIPELINE                                   */}
      {/* ============================================================== */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif text-stone-900">Client Fulfillment Orders (Firestore Collection)</h3>
              <p className="text-xs text-stone-500">Live courier tracking and WhatsApp dispatch management.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-bold">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer & City</th>
                    <th className="p-4">Manifest Items</th>
                    <th className="p-4">Payable (PKR)</th>
                    <th className="p-4">Payment Mode</th>
                    <th className="p-4">Courier Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/80">
                      <td className="p-4 font-mono font-bold text-stone-900">
                        #{ord.id}
                        <p className="text-[10px] text-stone-400 font-sans font-normal">{ord.createdAt}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-stone-900">{ord.customerName}</p>
                        <p className="text-[11px] text-stone-500">{ord.phone} • {ord.city}</p>
                        <p className="text-[10px] text-stone-400 truncate max-w-xs">{ord.address}</p>
                      </td>

                      <td className="p-4">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-stone-700">
                            {it.product.name} (x{it.quantity})
                          </div>
                        ))}
                      </td>

                      <td className="p-4 font-bold text-stone-900">
                        Rs. {ord.total.toLocaleString()}
                      </td>

                      <td className="p-4">
                        <span className="font-medium text-stone-800">{ord.paymentMethod}</span>
                        <p className={`text-[10px] font-semibold ${ord.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          ({ord.paymentStatus})
                        </p>
                      </td>

                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="px-2.5 py-1.5 border border-stone-300 rounded font-semibold text-xs bg-stone-50 focus:outline-none focus:border-stone-900"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ord.customerName}, this is Lumora Skincare Concierge regarding your order #${ord.id}. Your parcel is currently ${ord.status}. Courier reference: ${ord.trackingNumber || 'Pending'}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded text-[11px] font-semibold uppercase tracking-wider hover:bg-emerald-700 inline-flex items-center gap-1"
                        >
                          <span>WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. PROMO DISCOUNT ENGINE (COUPONS)                             */}
      {/* ============================================================== */}
      {activeAdminTab === 'coupons' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Coupon Form */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-lg font-serif text-stone-900">Create Promotional Coupon</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Coupon Code (Uppercase)</label>
                  <input 
                    type="text"
                    placeholder="e.g. VIP25"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg uppercase tracking-wider font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Percentage (%)</label>
                  <input 
                    type="number"
                    min={1}
                    max={90}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Minimum Order Subtotal (PKR)</label>
                  <input 
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Internal Description</label>
                  <input 
                    type="text"
                    placeholder="e.g. Spring Radiance Campaign"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <button
                  onClick={async () => {
                    if (!newCouponCode) return;
                    await addCoupon({
                      code: newCouponCode,
                      discountPercentage: newCouponDiscount,
                      minOrderAmount: newCouponMin,
                      isActive: true,
                      description: newCouponDesc || `${newCouponDiscount}% VIP Discount`
                    });
                    setNewCouponCode('');
                    setNewCouponDesc('');
                  }}
                  className="w-full py-3 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-stone-800"
                >
                  Publish Promo Code to Firestore
                </button>
              </div>
            </div>

            {/* Existing Coupons Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden p-6 space-y-4">
              <h3 className="text-lg font-serif text-stone-900">Active Campaign Vouchers (Live in Firestore)</h3>
              <div className="divide-y divide-stone-100 text-xs">
                {coupons.map((c) => (
                  <div key={c.code} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">{c.code}</span>
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                          {c.discountPercentage}% OFF
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-0.5">{c.description} (Min Order: Rs. {c.minOrderAmount.toLocaleString()})</p>
                    </div>

                    <button
                      onClick={() => toggleCouponActive(c.code)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. BRAND & WHATSAPP SETTINGS                                   */}
      {/* ============================================================== */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-xl font-serif text-stone-900">Storefront & WhatsApp Parameters</h3>
            <p className="text-xs text-stone-500">Configure logistics thresholds and official communication numbers in Cloud Firestore.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Official WhatsApp Concierge Number (with Country Code)</label>
              <input 
                type="text"
                value={editableSettings.whatsappNumber}
                onChange={(e) => setEditableSettings({ ...editableSettings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg font-mono font-bold text-stone-900 text-xs"
              />
              <p className="text-[10px] text-stone-400 mt-1">Orders generated by customers will be prefilled and sent to this number.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Free Delivery Threshold (PKR)</label>
                <input 
                  type="number"
                  value={editableSettings.freeShippingThreshold}
                  onChange={(e) => setEditableSettings({ ...editableSettings, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Flat Delivery Rate (PKR)</label>
                <input 
                  type="number"
                  value={editableSettings.flatShippingRate}
                  onChange={(e) => setEditableSettings({ ...editableSettings, flatShippingRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Announcement Ticker Header</label>
              <input 
                type="text"
                value={editableSettings.announcementText}
                onChange={(e) => setEditableSettings({ ...editableSettings, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div className="pt-4 border-t border-stone-200">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2">Meezan Bank Deposit Account (for Client Transfers)</h4>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text"
                  placeholder="Bank Name"
                  value={editableSettings.bankDetails.bankName}
                  onChange={(e) => setEditableSettings({
                    ...editableSettings,
                    bankDetails: { ...editableSettings.bankDetails, bankName: e.target.value }
                  })}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
                <input 
                  type="text"
                  placeholder="Account Title"
                  value={editableSettings.bankDetails.accountTitle}
                  onChange={(e) => setEditableSettings({
                    ...editableSettings,
                    bankDetails: { ...editableSettings.bankDetails, accountTitle: e.target.value }
                  })}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
                <input 
                  type="text"
                  placeholder="Account Number"
                  value={editableSettings.bankDetails.accountNumber}
                  onChange={(e) => setEditableSettings({
                    ...editableSettings,
                    bankDetails: { ...editableSettings.bankDetails, accountNumber: e.target.value }
                  })}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
                <input 
                  type="text"
                  placeholder="IBAN (PK...)"
                  value={editableSettings.bankDetails.iban}
                  onChange={(e) => setEditableSettings({
                    ...editableSettings,
                    bankDetails: { ...editableSettings.bankDetails, iban: e.target.value }
                  })}
                  className="px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => updateSettings(editableSettings)}
              className="py-3 px-6 bg-stone-900 text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish All Configurations to Firestore</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
