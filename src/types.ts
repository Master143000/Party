export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  discount?: number;
  tags: string[];
  spiceLevel: number;
  available: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  type: 'delivery' | 'takeaway';
  createdAt: number;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  expiryDate: string;
  active: boolean;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  active: boolean;
}

export interface RestaurantSettings {
  name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  timings: {
    open: string;
    close: string;
  };
  delivery: {
    charges: number;
    estimatedTime: string;
  };
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
