import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { FirebaseService } from './services/firebaseService';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  CreditCard, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Minus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from './lib/utils';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    address: '',
    type: 'delivery' as 'delivery' | 'takeaway',
    notes: ''
  });

  // Sync name when user becomes available
  useEffect(() => {
    if (user?.displayName && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.displayName || '' }));
    }
  }, [user, formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderId = await FirebaseService.placeOrder({
        userId: user.uid,
        items,
        total,
        status: 'pending',
        customerName: formData.name,
        phone: formData.phone,
        address: formData.type === 'delivery' ? formData.address : 'Takeaway',
        type: formData.type,
        notes: formData.notes,
        createdAt: Date.now()
      }, items);

      if (orderId) {
        setOrderComplete(orderId);
        clearCart();
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="pt-32 pb-32 min-h-screen flex items-center justify-center container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark p-12 rounded-radius-3xl border border-primary/20 text-center max-w-lg w-full fire-glow"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-primary" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">ORDER <span className="text-primary italic">PLACED!</span></h2>
          <p className="text-gray-400 mb-8 font-light text-lg">
            Your order <span className="text-white font-mono font-bold">#{orderComplete.slice(-6).toUpperCase()}</span> is being prepared with fire and love.
          </p>
          
          <div className="flex flex-col gap-4">
            <Link 
              to={`/track/${orderComplete}`}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl"
            >
              TRACK ORDER NOW
            </Link>
            <Link 
              to="/menu"
              className="w-full py-4 glass border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
            >
              BACK TO MENU
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-32 min-h-screen flex items-center justify-center container mx-auto px-6">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto text-white/5 mb-8" />
          <h2 className="text-4xl font-display font-bold mb-4">YOUR CART IS <span className="text-primary italic">EMPTY</span></h2>
          <p className="text-gray-500 mb-8">Add some legendary boxes to your cart before checking out.</p>
          <Link to="/menu" className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all">
            GO TO MENU
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0C0C0C]">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <Link to="/menu" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-4">
            <ArrowLeft size={16} /> Back to menu
          </Link>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">CHECK<span className="text-primary italic">OUT</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-7 space-y-8">
            <section className="glass rounded-radius-3xl overflow-hidden border border-white/5">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 className="text-xl font-bold flex items-center gap-3">
                   <ShoppingBag size={20} className="text-primary" /> 
                   ORDER SUMMARY
                </h3>
                <span className="text-gray-500 text-sm font-bold">{items.length} Items</span>
              </div>
              <div className="divide-y divide-white/5">
                {items.map((item) => (
                  <div key={item.productId} className="p-8 flex gap-6 group">
                     <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 shrink-0 border border-white/10 group-hover:border-primary transition-colors">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between mb-2">
                           <h4 className="font-bold text-lg">{item.name}</h4>
                           <span className="font-display font-bold text-primary">Rs. {item.price * item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-3 bg-white/5 p-1 rounded-lg border border-white/10">
                              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 hover:text-primary transition-colors"><Minus size={14} /></button>
                              <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 hover:text-primary transition-colors"><Plus size={14} /></button>
                           </div>
                           <button onClick={() => removeFromCart(item.productId)} className="text-gray-500 hover:text-red-400 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-white/2 border-t border-white/5">
                 <div className="flex justify-between text-xl font-display font-bold">
                    <span>TOTAL AMOUNT</span>
                    <span className="text-primary">Rs. {total}</span>
                 </div>
              </div>
            </section>

            {!user && (
              <div className="glass p-8 rounded-radius-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Login to continue</h4>
                    <p className="text-sm text-gray-500">Save addresses and track your orders in real-time.</p>
                  </div>
                </div>
                <button onClick={login} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all whitespace-nowrap">
                  LOGIN NOW
                </button>
              </div>
            )}
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="sticky top-32 glass rounded-radius-3xl border border-white/5 overflow-hidden">
               <div className="p-8 border-b border-white/5 bg-white/2">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                     <CreditCard size={20} className="text-primary" /> 
                     DELIVERY DETAILS
                  </h3>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       type="button"
                       onClick={() => setFormData({...formData, type: 'delivery'})}
                       className={cn(
                         "p-4 rounded-2xl border font-bold transition-all flex flex-col items-center gap-2",
                         formData.type === 'delivery' ? "bg-primary border-primary text-white shadow-lg" : "glass border-white/10 text-gray-500"
                       )}
                     >
                        <Truck size={20} />
                        Delivery
                     </button>
                     <button 
                       type="button"
                       onClick={() => setFormData({...formData, type: 'takeaway'})}
                       className={cn(
                         "p-4 rounded-2xl border font-bold transition-all flex flex-col items-center gap-2",
                         formData.type === 'takeaway' ? "bg-primary border-primary text-white shadow-lg" : "glass border-white/10 text-gray-500"
                       )}
                     >
                        <ShoppingBag size={20} />
                        Takeaway
                     </button>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-black uppercase text-gray-500 mb-2">Customer Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary transition-all outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-black uppercase text-gray-500 mb-2">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          placeholder="+92 300 0000000"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary transition-all outline-none"
                        />
                     </div>
                     {formData.type === 'delivery' && (
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                       >
                          <label className="block text-xs font-black uppercase text-gray-500 mb-2">Delivery Address</label>
                          <textarea 
                            required
                            placeholder="Plot number, Street name, Area..."
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary transition-all outline-none resize-none"
                          />
                       </motion.div>
                     )}
                     <div>
                        <label className="block text-xs font-black uppercase text-gray-500 mb-2">Special Notes (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="No onions, extra spicy, etc."
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary transition-all outline-none"
                        />
                     </div>
                  </div>

                  <button 
                    disabled={loading || !user}
                    className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl fire-glow hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale pointer-events-auto"
                  >
                     {loading ? 'PROCESSING...' : (
                       <>PLACE ORDER <ChevronRight size={20} /></>
                     )}
                  </button>
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
