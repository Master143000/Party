import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  setDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category, Order, Reservation, Coupon, Banner, RestaurantSettings } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const FirebaseService = {
  // MENU
  async getCategories(): Promise<Category[]> {
    try {
      const snap = await getDocs(query(collection(db, 'menu_categories'), orderBy('order')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'menu_categories');
      return [];
    }
  },

  async getMenuItems(category?: string): Promise<Product[]> {
    try {
      let q = query(collection(db, 'menu_items'), where('available', '==', true));
      if (category && category !== 'All') {
        q = query(q, where('category', '==', category.toLowerCase().replace(' ', '-')));
      }
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'menu_items');
      return [];
    }
  },

  // ORDERS
  async placeOrder(order: Omit<Order, 'id'>, items: any[]): Promise<string> {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: Date.now()
      });
      
      // Add items as subcollection
      for (const item of items) {
        await addDoc(collection(db, `orders/${orderRef.id}/items`), item);
      }
      
      return orderRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'orders');
      return '';
    }
  },

  // RESERVATIONS
  async makeReservation(reservation: Omit<Reservation, 'id'>): Promise<string> {
    try {
      const resRef = await addDoc(collection(db, 'reservations'), {
        ...reservation,
        createdAt: Date.now(),
        status: 'pending'
      });
      return resRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'reservations');
      return '';
    }
  },

  // ADMIN METHODS
  async getAllOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'orders');
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `orders/${orderId}`);
    }
  }
};
