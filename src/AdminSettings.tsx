import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  ShieldCheck,
  CreditCard,
  Save,
  Globe,
  Bell,
  Lock
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    restaurantName: 'Party Fast Food',
    address: 'Plot #123, Sector 5-C/4, North Karachi, Karachi.',
    phone: '+92 300 1234567',
    openingHours: '12:00 PM - 02:00 AM',
    deliveryFee: 150,
    minOrderValue: 500,
    isOperational: true,
    promoMessage: 'Free delivery on orders above Rs. 2000!'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'settings', 'restaurant'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as any);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'restaurant'), settings);
      toast.success('Settings updated successfully!', {
        style: { background: '#333', color: '#fff', border: '1px solid #FF5C00' }
      });
    } catch (e) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Restaurant Settings</h1>
            <p className="text-gray-500 mt-1">Configure your business details and operational preferences.</p>
          </div>
        </header>

        <form onSubmit={handleSave} className="max-w-4xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Info */}
            <div className="glass p-8 rounded-radius-3xl border border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Globe size={20} />
                <h3 className="font-bold">General Information</h3>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Restaurant Name</label>
                <input 
                  type="text" 
                  value={settings.restaurantName}
                  onChange={(e) => setSettings({...settings, restaurantName: e.target.value})}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Detailed Address</label>
                <textarea 
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full min-h-24 bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Hours</label>
                  <input 
                    type="text" 
                    value={settings.openingHours}
                    onChange={(e) => setSettings({...settings, openingHours: e.target.value})}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery & Operations */}
            <div className="glass p-8 rounded-radius-3xl border border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Truck size={20} />
                <h3 className="font-bold">Delivery & Operations</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Delivery Fee (Rs.)</label>
                  <input 
                    type="number" 
                    value={settings.deliveryFee}
                    onChange={(e) => setSettings({...settings, deliveryFee: Number(e.target.value)})}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Min. Order (Rs.)</label>
                  <input 
                    type="number" 
                    value={settings.minOrderValue}
                    onChange={(e) => setSettings({...settings, minOrderValue: Number(e.target.value)})}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Promo Message Banner</label>
                <input 
                  type="text" 
                  value={settings.promoMessage}
                  onChange={(e) => setSettings({...settings, promoMessage: e.target.value})}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary outline-none"
                  placeholder="E.g. Discount on first order!"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                 <div>
                   <h4 className="font-bold text-sm">Operational Status</h4>
                   <p className="text-xs text-gray-500 mt-1">Accepting online orders</p>
                 </div>
                 <button 
                  type="button"
                  onClick={() => setSettings({...settings, isOperational: !settings.isOperational})}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.isOperational ? "bg-primary" : "bg-white/10"
                  )}
                 >
                   <div className={cn(
                     "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                     settings.isOperational ? "left-7" : "left-1"
                   )} />
                 </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <button 
              className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl fire-glow flex items-center gap-3 hover:bg-primary-light transition-all"
             >
               <Save size={20} /> SAVE ALL SETTINGS
             </button>
          </div>
        </form>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
           <div className="p-6 glass border border-white/5 rounded-2xl flex items-center gap-4">
              <Bell size={24} />
              <div>
                <h4 className="font-bold text-sm">Email Notifications</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Enable in Pro</p>
              </div>
           </div>
           <div className="p-6 glass border border-white/5 rounded-2xl flex items-center gap-4">
              <ShieldCheck size={24} />
              <div>
                <h4 className="font-bold text-sm">System Logs</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Enable in Pro</p>
              </div>
           </div>
           <div className="p-6 glass border border-white/5 rounded-2xl flex items-center gap-4">
              <Lock size={24} />
              <div>
                <h4 className="font-bold text-sm">API Tokens</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Enable in Pro</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
