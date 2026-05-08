import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { cn } from './lib/utils';
import { Product } from './types';
import { FirebaseService } from './services/firebaseService';
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function AdminMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'burgers',
    description: '',
    available: true,
    spiceLevel: 0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    tags: []
  });

  const categories = ['All', 'Burgers', 'BBQ Rolls', 'Pizza', 'Chinese', 'Broast', 'Biryani', 'Drinks'];

  useEffect(() => {
    const q = query(collection(db, 'menu_items'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.price || !formData.category) {
        alert('Please fill all required fields');
        return;
      }

      await addDoc(collection(db, 'menu_items'), {
        ...formData,
        createdAt: Date.now()
      });
      
      setIsModalOpen(false);
      setFormData({
        name: '',
        price: 0,
        category: 'burgers',
        description: '',
        available: true,
        spiceLevel: 0,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
        tags: []
      });
    } catch (e) {
      console.error(e);
      alert('Error saving item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, 'menu_items', id));
    } catch (e) {
      console.error(e);
      alert('Error deleting item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory.toLowerCase().replace(' ', '-');
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 ml-64 p-12 bg-[#080808] min-h-screen text-white">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Menu Management</h1>
          <p className="text-gray-400 mt-1">Manage your food titles, prices and availability.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all transform hover:scale-105"
        >
          <Plus size={20} />
          Add New Food
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..." 
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all",
                selectedCategory === cat ? "bg-primary text-white" : "glass text-gray-400 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : filteredItems.map((item) => (
          <div key={item.id} className="glass rounded-2xl p-4 group">
            <div className="aspect-video rounded-xl bg-white/5 mb-4 relative overflow-hidden">
               <img 
                 src={item.image} 
                 alt={item.name} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute top-2 right-2 flex gap-1">
                 <button className="p-2 glass rounded-lg hover:bg-white/20 transition-all">
                   <Edit2 size={14} />
                 </button>
                 <button 
                   onClick={() => handleDelete(item.id)}
                   className="p-2 glass rounded-lg hover:bg-red-500/20 text-red-400 border-red-500/20 hover:text-red-300 transition-all"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
            </div>
            <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold">{item.name}</h4>
               <span className="text-sm font-display font-medium text-primary">Rs. {item.price}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4 line-clamp-2 italic">{item.description}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{item.category}</span>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs", item.available ? "text-green-400" : "text-gray-500")}>
                  {item.available ? 'Available' : 'Hidden'}
                </span>
                <div 
                  className={cn("w-8 h-4 rounded-full relative transition-colors cursor-pointer", item.available ? "bg-green-400/20" : "bg-white/10")}
                  onClick={async () => {
                    await updateDoc(doc(db, 'menu_items', item.id), { available: !item.available });
                  }}
                >
                  <div className={cn("absolute top-0.5 w-3 h-3 rounded-full transition-all", item.available ? "right-0.5 bg-green-400" : "left-0.5 bg-gray-500")} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal placeholder */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl glass-dark rounded-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-display font-bold mb-8">Add Food Item</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Food Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary" 
                    placeholder="e.g. Zinger Supreme" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Price (Rs.)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary appearance-none"
                    >
                       {categories.slice(1).map(c => <option key={c} value={c.toLowerCase().replace(' ', '-')}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary" 
                    placeholder="Briefly describe the food..." 
                  />
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Food Image URL</label>
                   <input 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-primary mb-2" 
                    placeholder="https://images.unsplash.com/..." 
                  />
                   <div className="border border-white/10 rounded-2xl h-40 flex items-center justify-center overflow-hidden">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-400">Image Preview</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    onClick={handleSave}
                    className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all transform hover:scale-[1.02]"
                   >
                     Save Changes
                   </button>
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="px-8 py-4 glass text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                   >
                     Cancel
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
