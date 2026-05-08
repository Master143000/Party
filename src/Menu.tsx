import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShoppingCart, Flame } from 'lucide-react';
import { FirebaseService } from './services/firebaseService';
import { Product, Category } from './types';
import { cn } from './lib/utils';
import { useCart } from './CartContext';

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      const [cats, items] = await Promise.all([
        FirebaseService.getCategories(),
        FirebaseService.getMenuItems()
      ]);
      setCategories(cats);
      setProducts(items);
      setLoading(false);
    }
    loadMenu();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory.toLowerCase().replace(' ', '-');
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0C0C0C]">
      <div className="container mx-auto px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">OUR <span className="text-primary italic">MENU</span></h1>
            <p className="text-gray-400 mt-2">Hand-crafted fire, delivered to your door.</p>
          </div>
          
          <div className="w-full md:w-96 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your favorite food..." 
              className="w-full h-16 bg-white/5 border border-white/10 rounded-full pl-14 pr-6 focus:outline-none focus:border-primary transition-all text-lg"
            />
          </div>
        </header>

        {/* Categories Bar */}
        <div className="sticky top-24 z-40 bg-[#0C0C0C]/80 backdrop-blur-md py-4 -mx-6 px-6 mb-12 border-b border-white/5">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "px-8 py-3 whitespace-nowrap rounded-full font-bold transition-all border",
                selectedCategory === 'All' ? "bg-primary border-primary text-white" : "glass border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              )}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  "px-8 py-3 whitespace-nowrap rounded-full font-bold transition-all border",
                  selectedCategory === cat.name ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(255,92,0,0.3)]" : "glass border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-white/5 rounded-radius-2xl mb-6" />
                <div className="h-6 bg-white/5 rounded w-2/3 mb-2" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative flex flex-col h-full"
                >
                  <div className="relative aspect-[4/5] rounded-radius-2xl overflow-hidden mb-6 fire-glow transition-all duration-500 group-hover:-translate-y-2">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {product.spiceLevel > 0 && (
                      <div className="absolute top-4 left-4 flex gap-1">
                        {[...Array(product.spiceLevel)].map((_, i) => (
                          <Flame key={i} size={16} className="text-primary fill-primary" />
                        ))}
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end max-w-[150px]">
                      {product.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase rounded-full shadow-lg">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        ADD TO CART
                      </button>
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-display font-bold tracking-tight">{product.name}</h3>
                      <span className="text-xl font-display font-bold text-primary">Rs. {product.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
            <ShoppingCart size={64} className="mx-auto text-white/5 mb-6" />
            <h3 className="text-2xl font-display font-bold text-gray-500">No items found in this category</h3>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Cart for Mobile */}
      <div className="fixed bottom-32 right-6 md:hidden z-50">
        <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,92,0,0.5)] border-4 border-black group active:scale-90 transition-transform">
           <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
           <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-primary text-xs font-bold rounded-full flex items-center justify-center border-2 border-black">0</span>
        </button>
      </div>
    </div>
  );
}

