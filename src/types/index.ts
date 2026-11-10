export type ProductCategory = 'Serums' | 'Moisturizers' | 'Cleansers' | 'Sunscreens' | 'Toners' | 'Bundles';

export interface Review {
  id: string;
  productId?: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  skinType?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  stock: number;
  description: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  skinType: string;
  size: string;
  image: string;
  secondaryImage?: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  model3DType: 'serum' | 'cream' | 'cleanser' | 'sunscreen';
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'COD' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Card';

export type OrderStatus = 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string; // e.g. LMR-849201
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
  courier?: 'TCS Express' | 'Trax Logistics' | 'Call Courier';
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  isActive: boolean;
  description: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  announcementText: string;
  isAnnouncementActive: boolean;
  storeEmail: string;
  storePhone: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  easypaisaNumber: string;
  easypaisaTitle: string;
  jazzCashNumber: string;
  jazzCashTitle: string;
}
