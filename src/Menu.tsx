import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShoppingCart, Flame } from 'lucide-react';
import { FirebaseService } from './services/firebaseService';
import { Product, Category } from './types';
import { cn } from './lib/utils';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart, itemCount } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      try {
        const [cats, items] = await Promise.all([
          FirebaseService.getCategories(),
          FirebaseService.getMenuItems()
        ]);
        
        setCategories(cats);
        setProducts(items);
      } catch (e) {
        console.error("Error loading menu:", e);
      } finally {
        setLoading(false);
      }
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
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col h-full cursor-pointer"
                >
                  <div className="relative aspect-[4/5] rounded-radius-3xl overflow-hidden mb-6 fire-glow transition-all duration-500 border border-white/5 bg-white/5 group">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {product.spiceLevel > 0 && (
                      <div className="absolute top-4 left-4 flex gap-1 z-10">
                        {[...Array(product.spiceLevel)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                          >
                            <Flame size={16} className="text-primary fill-primary drop-shadow-[0_0_8px_rgba(255,92,0,0.8)]" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end max-w-[150px] z-10">
                      {product.tags && product.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase rounded-full shadow-xl">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] z-10 transition-all duration-500">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          import('react-hot-toast').then(t => t.toast.success(`${product.name} added to cart!`, {
                            style: { background: '#1A1A1A', color: '#fff', border: '1px solid #FF5C00' }
                          }));
                        }}
                        className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all shadow-2xl flex items-center justify-center gap-2 border border-primary"
                      >
                        <ShoppingCart size={18} />
                        ADD TO CART
                      </motion.button>
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-display font-bold tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
                      <motion.span 
                        className="text-xl font-display font-bold text-primary"
                        whileHover={{ scale: 1.1 }}
                      >
                        Rs. {product.price}
                      </motion.span>
                    </div>
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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

    </div>
  );
}

