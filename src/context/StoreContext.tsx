import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon, StoreSettings, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_SETTINGS, INITIAL_ORDERS } from '../data/initialData';
import { 
  db, 
  auth, 
  testConnection, 
  handleFirestoreError, 
  OperationType, 
  checkIsAdmin,
  signInAdminWithGoogle,
  signOutUser
} from '../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  limit
} from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';

interface ContactInquiryData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Auth state
  currentUser: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  loginAdminWithGoogle: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  
  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  
  // Price calculations
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  orderTotal: number;
  cartCount: number;
  
  // Coupon
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Orders
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Admin Product Operations
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  
  // Admin Coupon & Settings
  updateSettings: (settings: StoreSettings) => Promise<void>;
  addCoupon: (coupon: Coupon) => Promise<void>;
  toggleCouponActive: (code: string) => Promise<void>;
  
  // Reviews
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => Promise<void>;

  // Forms to Firestore
  submitContactInquiry: (inquiry: ContactInquiryData) => Promise<boolean>;
  subscribeNewsletter: (email: string) => Promise<boolean>;
  
  // WhatsApp helper
  getWhatsAppOrderUrl: (order: Order) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('lumora_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Test connection on initial boot
  useEffect(() => {
    testConnection();
  }, []);

  // Monitor Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminCheck = await checkIsAdmin(user);
        setIsAdmin(adminCheck);
      } else {
        setIsAdmin(false);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronization with Cloud Firestore
  useEffect(() => {
    const productsPath = 'products';
    const unsubProducts = onSnapshot(collection(db, productsPath), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreProducts: Product[] = [];
        snapshot.forEach((docSnap) => {
          firestoreProducts.push(docSnap.data() as Product);
        });
        setProducts(firestoreProducts);
        localStorage.setItem('lumora_products', JSON.stringify(firestoreProducts));
      } else {
        // Seed initial formulations to Firestore on first launch
        INITIAL_PRODUCTS.forEach(async (prod) => {
          try {
            await setDoc(doc(db, productsPath, prod.id), prod);
          } catch {
            // ignore if permissions or background
          }
        });
      }
    }, (error) => {
      console.warn("Firestore products live sync notice:", error.message);
    });

    const couponsPath = 'coupons';
    const unsubCoupons = onSnapshot(collection(db, couponsPath), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreCoupons: Coupon[] = [];
        snapshot.forEach((docSnap) => {
          firestoreCoupons.push(docSnap.data() as Coupon);
        });
        setCoupons(firestoreCoupons);
        localStorage.setItem('lumora_coupons', JSON.stringify(firestoreCoupons));
      } else {
        INITIAL_COUPONS.forEach(async (c) => {
          try {
            await setDoc(doc(db, couponsPath, c.code), c);
          } catch {
            // ignore
          }
        });
      }
    }, (error) => {
      console.warn("Firestore coupons live sync notice:", error.message);
    });

    const settingsPath = 'settings';
    const unsubSettings = onSnapshot(doc(db, settingsPath, 'config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as StoreSettings;
        setSettings(data);
        localStorage.setItem('lumora_settings', JSON.stringify(data));
      } else {
        setDoc(doc(db, settingsPath, 'config'), INITIAL_SETTINGS).catch(() => {});
      }
    }, (error) => {
      console.warn("Firestore settings live sync notice:", error.message);
    });

    return () => {
      unsubProducts();
      unsubCoupons();
      unsubSettings();
    };
  }, []);

  // Sync orders if Admin or Local
  useEffect(() => {
    if (isAdmin) {
      const ordersPath = 'orders';
      const unsubOrders = onSnapshot(collection(db, ordersPath), (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Order);
          });
          list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setOrders(list);
          localStorage.setItem('lumora_orders', JSON.stringify(list));
        }
      }, (err) => {
        console.warn("Admin orders live sync notice:", err.message);
      });
      return () => unsubOrders();
    }
  }, [isAdmin]);

  // Sync cart and wishlist to local storage
  useEffect(() => {
    localStorage.setItem('lumora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Google Login for Admin
  const loginAdminWithGoogle = async () => {
    try {
      const res = await signInAdminWithGoogle();
      setCurrentUser(res.user);
      setIsAdmin(res.isAdmin);
      if (res.isAdmin) {
        showToast(`Welcome Administrator, ${res.user.displayName || res.user.email}!`);
      } else {
        showToast(`Signed in as ${res.user.email}. (Standard access)`);
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication encountered an error.');
    }
  };

  const logoutAdmin = async () => {
    await signOutUser();
    setCurrentUser(null);
    setIsAdmin(false);
    showToast('Secure session closed.');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to your vanity bag.`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed item from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved item to your personal wishlist.');
        return [...prev, productId];
      }
    });
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= settings.freeShippingThreshold || subtotal === 0 ? 0 : settings.flatShippingRate;

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    discountAmount = Math.round((subtotal * appliedCoupon.discountPercentage) / 100);
  }

  const orderTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Apply Coupon
  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired promotional voucher code.' };
    }

    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Code ${found.code} requires a minimum order subtotal of Rs. ${found.minOrderAmount.toLocaleString()}.`
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Promo ${found.code} applied! Enjoy ${found.discountPercentage}% discount.`
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo discount removed.');
  };

  // Place Order (Stores directly in Cloud Firestore)
  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const randomId = `LMR-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      ...orderData,
      id: randomId,
      status: 'Processing',
      createdAt: dateStr,
      trackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier: 'TCS Express'
    };

    // Save to Cloud Firestore
    const orderDocPath = `orders/${randomId}`;
    try {
      await setDoc(doc(db, 'orders', randomId), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, orderDocPath);
    }

    // Deduct stock in Firestore
    orderData.items.forEach(async (item) => {
      try {
        const prodRef = doc(db, 'products', item.product.id);
        const currentProd = products.find(p => p.id === item.product.id);
        if (currentProd) {
          const newStock = Math.max(0, currentProd.stock - item.quantity);
          await setDoc(prodRef, { stock: newStock }, { merge: true });
        }
      } catch {
        // non-blocking
      }
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderDocPath = `orders/${orderId}`;
    try {
      await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
      showToast(`Order #${orderId} status set to ${status}.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, orderDocPath);
    }
  };

  // Admin Product Operations with Firestore
  const updateProduct = async (updated: Product) => {
    const productDocPath = `products/${updated.id}`;
    try {
      await setDoc(doc(db, 'products', updated.id), updated, { merge: true });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(`Formulation "${updated.name}" updated in Cloud Firestore.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, productDocPath);
    }
  };

  const addProduct = async (newProduct: Product) => {
    const productDocPath = `products/${newProduct.id}`;
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Formulation "${newProduct.name}" saved to Firestore.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, productDocPath);
    }
  };

  const deleteProduct = async (productId: string) => {
    const productDocPath = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('Formulation removed from Firestore.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, productDocPath);
    }
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    const settingsDocPath = 'settings/config';
    try {
      await setDoc(doc(db, 'settings', 'config'), newSettings);
      setSettings(newSettings);
      showToast('Storefront configurations saved to Firestore.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, settingsDocPath);
    }
  };

  const addCoupon = async (newCoupon: Coupon) => {
    const couponDocPath = `coupons/${newCoupon.code}`;
    try {
      await setDoc(doc(db, 'coupons', newCoupon.code), newCoupon);
      setCoupons((prev) => [...prev, newCoupon]);
      showToast(`Promo voucher ${newCoupon.code} published.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, couponDocPath);
    }
  };

  const toggleCouponActive = async (code: string) => {
    const couponDocPath = `coupons/${code}`;
    const target = coupons.find(c => c.code === code);
    if (!target) return;
    try {
      await setDoc(doc(db, 'coupons', code), { isActive: !target.isActive }, { merge: true });
      setCoupons((prev) =>
        prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, couponDocPath);
    }
  };

  // Reviews with Firestore
  const addReview = async (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    const revId = `rev-${Date.now()}`;
    const newRev: Review = {
      ...review,
      id: revId,
      productId,
      date: 'Just now'
    };

    const reviewDocPath = `reviews/${revId}`;
    try {
      await setDoc(doc(db, 'reviews', revId), newRev);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, reviewDocPath);
    }

    // Update local state and product in Firestore
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const currentReviews = prod.reviews || [];
          const updatedReviews = [newRev, ...currentReviews];
          const avgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          const updatedProd = {
            ...prod,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: Math.round(avgRating * 10) / 10
          };
          // Sync product rating
          setDoc(doc(db, 'products', productId), {
            rating: updatedProd.rating,
            reviewsCount: updatedProd.reviewsCount
          }, { merge: true }).catch(() => {});
          return updatedProd;
        }
        return prod;
      })
    );

    showToast('Thank you! Your verified client review has been published.');
  };

  // Submit Contact Form to Firestore
  const submitContactInquiry = async (inquiry: ContactInquiryData): Promise<boolean> => {
    const inqId = `inq-${Date.now()}`;
    const inqDocPath = `inquiries/${inqId}`;
    try {
      await setDoc(doc(db, 'inquiries', inqId), {
        id: inqId,
        ...inquiry,
        createdAt: new Date().toISOString()
      });
      showToast('Thank you for contacting Lumora. Our concierge will reach out within 2 hours.');
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, inqDocPath);
    }
  };

  // Subscribe Newsletter to Firestore
  const subscribeNewsletter = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const subDocId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const subDocPath = `subscribers/${subDocId}`;
    try {
      await setDoc(doc(db, 'subscribers', subDocId), {
        email: cleanEmail,
        subscribedAt: new Date().toISOString()
      });
      showToast('Welcome to The Lumora Journal. Check your inbox for your 15% VIP code.');
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, subDocPath);
    }
  };

  // Build WhatsApp Order Link
  const getWhatsAppOrderUrl = (order: Order) => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    let msg = `✨ *LUMORA SKINCARE - ORDER PROTOCOL* ✨\n\n`;
    msg += `*Order Reference:* #${order.id}\n`;
    msg += `*Customer:* ${order.customerName}\n`;
    msg += `*Phone:* ${order.phone}\n`;
    if (order.email) msg += `*Email:* ${order.email}\n`;
    msg += `*Destination:* ${order.address}, ${order.city}\n`;
    if (order.deliveryNotes) msg += `*Notes:* ${order.deliveryNotes}\n`;
    msg += `\n*Selected Formulations:*\n`;

    order.items.forEach((item, index) => {
      msg += `${index + 1}. ${item.product.name} (x${item.quantity}) — Rs. ${(item.product.price * item.quantity).toLocaleString()}\n`;
    });

    msg += `\n*Subtotal:* Rs. ${order.subtotal.toLocaleString()}`;
    if (order.discount > 0) msg += `\n*VIP Discount:* -Rs. ${order.discount.toLocaleString()}`;
    msg += `\n*Delivery Fee:* ${order.shipping === 0 ? 'COMPLIMENTARY' : `Rs. ${order.shipping}`}`;
    msg += `\n*Payable Total:* Rs. ${order.total.toLocaleString()}\n`;
    msg += `*Payment Method:* ${order.paymentMethod}\n`;
    msg += `*Payment Status:* ${order.paymentStatus}\n\n`;
    msg += `Kindly confirm dispatch scheduling and courier tracking. Thank you!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        coupons,
        settings,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        isQuizOpen,
        setIsQuizOpen,
        toastMessage,
        showToast,
        currentUser,
        isAdmin,
        isAuthLoading,
        loginAdminWithGoogle,
        logoutAdmin,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        subtotal,
        shippingFee,
        discountAmount,
        orderTotal,
        cartCount,
        applyCouponCode,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        updateProduct,
        addProduct,
        deleteProduct,
        updateSettings,
        addCoupon,
        toggleCouponActive,
        addReview,
        submitContactInquiry,
        subscribeNewsletter,
        getWhatsAppOrderUrl
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
