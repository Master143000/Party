import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Calendar, 
  Percent, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { onSnapshot, collection, query, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminPromotions() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 10,
    type: 'percentage', // percentage or fixed
    minOrder: 500,
    active: true
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'coupons'), {
      ...newCoupon,
      code: newCoupon.code.toUpperCase(),
      createdAt: Date.now()
    });
    setIsModalOpen(false);
    setNewCoupon({ code: '', discount: 10, type: 'percentage', minOrder: 500, active: true });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this coupon?')) {
      await deleteDoc(doc(db, 'coupons', id));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Promotions & Coupons</h1>
            <p className="text-gray-500 mt-1">Create and manage discount codes for your customers.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-3 hover:bg-primary-light transition-all shadow-xl fire-glow"
          >
            <Plus size={20} /> CREATE NEW COUPON
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <motion.div 
                layout
                key={coupon.id}
                className="glass p-8 rounded-radius-3xl border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Tag size={120} />
                </div>
                
                <div className="flex justify-between items-start mb-10">
                  <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="text-primary font-mono font-black text-xl tracking-widest">{coupon.code}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-end gap-2">
                     <span className="text-4xl font-display font-black">
                       {coupon.type === 'percentage' ? `${coupon.discount}%` : `Rs. ${coupon.discount}`}
                     </span>
                     <span className="text-gray-500 mb-1 font-bold">OFF</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>Minimum Order: <span className="text-white font-bold">Rs. {coupon.minOrder}</span></p>
                    <p className="mt-1 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-400" /> Currently Active
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                   <span>Used: 0 times</span>
                   <span>Value: Limited</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 italic">
               {loading ? 'Loading coupons...' : 'No active promotions found. Create one to get started!'}
            </div>
          )}
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-dark border border-white/10 w-full max-w-xl rounded-radius-3xl overflow-hidden relative z-10"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-2xl font-display font-bold">New Coupon Code</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
                </div>

                <form onSubmit={handleCreate} className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-gray-500 mb-2">Coupon Code</label>
                        <input 
                          required
                          type="text" 
                          placeholder="E.G. RAMADAN20"
                          value={newCoupon.code}
                          onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-mono text-xl tracking-widest focus:border-primary outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500 mb-2">Discount Value</label>
                          <input 
                            required
                            type="number" 
                            value={newCoupon.discount}
                            onChange={(e) => setNewCoupon({...newCoupon, discount: Number(e.target.value)})}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500 mb-2">Min. Order (Rs.)</label>
                          <input 
                            required
                            type="number" 
                            value={newCoupon.minOrder}
                            onChange={(e) => setNewCoupon({...newCoupon, minOrder: Number(e.target.value)})}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      <div>
                         <label className="block text-xs font-black uppercase text-gray-500 mb-2">Discount Type</label>
                         <div className="grid grid-cols-2 gap-4">
                            <button 
                              type="button"
                              onClick={() => setNewCoupon({...newCoupon, type: 'percentage'})}
                              className={cn(
                                "py-4 rounded-2xl border font-bold transition-all",
                                newCoupon.type === 'percentage' ? "bg-primary border-primary " : "bg-white/5 border-white/10 text-gray-500"
                              )}
                            >
                               Percentage (%)
                            </button>
                            <button 
                              type="button"
                              onClick={() => setNewCoupon({...newCoupon, type: 'fixed'})}
                              className={cn(
                                "py-4 rounded-2xl border font-bold transition-all",
                                newCoupon.type === 'fixed' ? "bg-primary border-primary " : "bg-white/5 border-white/10 text-gray-500"
                              )}
                            >
                               Fixed Amount (Rs.)
                            </button>
                         </div>
                      </div>
                   </div>

                   <button className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl fire-glow mt-4">
                      CREATE COUPON
                   </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
