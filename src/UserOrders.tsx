import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Order } from './types';
import { 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  Truck,
  ArrowRight,
  Flame
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from './lib/utils';

export default function UserOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-400" />;
      case 'preparing': return <Flame size={16} className="text-blue-400" />;
      case 'out-for-delivery': return <Truck size={16} className="text-purple-400" />;
      case 'delivered': return <CheckCircle2 size={16} className="text-green-400" />;
      case 'cancelled': return <XCircle size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
      case 'preparing': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      case 'out-for-delivery': return 'bg-purple-400/10 text-purple-400 border-purple-400/20';
      case 'delivered': return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'cancelled': return 'bg-red-400/10 text-red-400 border-red-400/20';
      default: return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
    }
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0C0C0C]">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">MY <span className="text-primary italic">CRAVINGS</span></h1>
          <p className="text-gray-400 mt-2">Relive your most fire food moments.</p>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 glass rounded-radius-3xl animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass group rounded-radius-3xl border border-white/5 overflow-hidden hover:border-primary/30 transition-all duration-500"
                >
                  <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</span>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-2 border",
                          getStatusBg(order.status)
                        )}>
                          {getStatusIcon(order.status)}
                          {order.status.replace('-', ' ')}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">
                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} — <span className="text-primary">Rs. {order.total}</span>
                      </h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, i) => (
                           <span key={i} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">
                             {item.quantity}x {item.name}
                           </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 shrink-0">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <Link 
                        to={`/track/${order.id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl font-bold group-hover:bg-primary group-hover:text-white transition-all"
                      >
                        VIEW DETAILS <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center">
            <ShoppingBag size={80} className="mx-auto text-white/5 mb-8" />
            <h2 className="text-4xl font-display font-bold mb-4 tracking-tighter text-gray-500">YOU HAVEN'T ORDERED <span className="italic">YET</span></h2>
            <Link to="/menu" className="mt-8 inline-block px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all">
              EXPLORE OUR MENU
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
