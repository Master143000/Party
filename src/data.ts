import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'burgers', name: 'Burgers', order: 1 },
  { id: 'bbq-rolls', name: 'BBQ Rolls', order: 2 },
  { id: 'pizza', name: 'Pizza', order: 3 },
  { id: 'chinese', name: 'Chinese', order: 4 },
  { id: 'broast', name: 'Broast', order: 5 },
  { id: 'biryani', name: 'Biryani', order: 6 },
  { id: 'karahi', name: 'Karahi & Handi', order: 7 },
  { id: 'sandwiches', name: 'Sandwiches', order: 8 },
  { id: 'fry-items', name: 'Fry Items', order: 9 },
  { id: 'platters', name: 'Platters', order: 10 },
  { id: 'pasta', name: 'Pasta', order: 11 },
  { id: 'pizza-fries', name: 'Pizza Fries', order: 12 },
  { id: 'salads', name: 'Salads', order: 13 },
  { id: 'drinks', name: 'Drinks', order: 14 },
  { id: 'desserts', name: 'Desserts', order: 15 },
];

export const PRODUCTS: Product[] = [
  // BURGERS
  {
    id: 'b1',
    name: 'Zinger Burger',
    description: 'Crunchy chicken fillet with signature mayo and fresh lettuce.',
    price: 300,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    tags: ['Best Seller', 'Crispy'],
    spiceLevel: 2,
    available: true,
    createdAt: Date.now()
  },
  {
    id: 'b2',
    name: 'Zinger Cheese Burger',
    description: 'The classic Zinger with an extra slice of melted cheddar.',
    price: 330,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    tags: ['Cheese'],
    spiceLevel: 2,
    available: true,
    createdAt: Date.now()
  },
  // BBQ ROLLS
  {
    id: 'r1',
    name: 'Chicken Roll',
    description: 'Juicy BBQ chicken wrapped in a soft paratha with chutney.',
    price: 170,
    category: 'bbq-rolls',
    image: 'https://images.unsplash.com/photo-1626776876729-bab4369a565a?auto=format&fit=crop&q=80&w=800',
    tags: ['BBQ'],
    spiceLevel: 1,
    available: true,
    createdAt: Date.now()
  },
  {
    id: 'r2',
    name: 'Chicken Mayo Roll',
    description: 'BBQ chicken with a creamy garlic mayo twist.',
    price: 180,
    category: 'bbq-rolls',
    image: 'https://images.unsplash.com/photo-1626776876729-bab4369a565a?auto=format&fit=crop&q=80&w=800',
    tags: ['Creamy'],
    spiceLevel: 1,
    available: true,
    createdAt: Date.now()
  }
];
