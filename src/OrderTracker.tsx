import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Order } from './types';
import { 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ShoppingBag,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { cn } from './lib/utils';

export default function OrderTracker() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'orders', id), (snap) => {
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() } as Order);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center container mx-auto px-6">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto text-white/5 mb-8" />
          <h2 className="text-4xl font-display font-bold mb-4">ORDER <span className="text-primary italic">NOT FOUND</span></h2>
          <Link to="/menu" className="mt-6 text-primary font-bold hover:underline">Return to menu</Link>
        </div>
      </div>
    );
  }

  const steps = [
    { status: 'pending', label: 'Order Received', icon: ShoppingBag, color: 'text-yellow-400' },
    { status: 'preparing', label: 'Chef is Cooking', icon: ChefHat, color: 'text-blue-400' },
    { status: 'out-for-delivery', label: 'Out for Delivery', icon: Bike, color: 'text-purple-400' },
    { status: 'delivered', label: 'Enjoy your Meal!', icon: CheckCircle2, color: 'text-green-400' }
  ];

  const currentStep = steps.findIndex(s => s.status === order.status);

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0C0C0C]">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> My Orders
            </Link>
            <h1 className="text-5xl font-display font-bold tracking-tighter">TRACK <span className="text-primary italic">ORDER</span></h1>
            <p className="font-mono text-gray-500 mt-2">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold">
            {order.status.replace('-', ' ').toUpperCase()}
          </div>
        </header>

        {/* Tracking Bar */}
        <div className="glass rounded-radius-3xl border border-white/5 p-8 md:p-12 mb-12">
           <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-white/5 rounded-full">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                   className="h-full bg-primary fire-glow"
                 />
              </div>

              {steps.map((step, index) => {
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center">
                     <motion.div 
                       animate={{ 
                         scale: isCurrent ? [1, 1.2, 1] : 1,
                         backgroundColor: isActive ? '#FF5C00' : '#1A1A1A'
                       }}
                       transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                       className={cn(
                         "w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#0C0C0C] transition-colors",
                         isActive ? "text-white" : "text-gray-600"
                       )}
                     >
                        <step.icon size={20} />
                     </motion.div>
                     <span className={cn(
                       "mt-4 text-[10px] md:text-xs font-black uppercase tracking-wider text-center max-w-[80px]",
                       isActive ? "text-white" : "text-gray-600"
                     )}>
                        {step.label}
                     </span>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Order Details */}
           <div className="glass rounded-radius-3xl border border-white/5 p-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                 <ShoppingBag size={20} className="text-primary" />
                 ORDER DETAILS
              </h3>
              <div className="space-y-4">
                 {order.items.map((item, i) => (
                   <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-400"><span className="font-bold text-white">{item.quantity}x</span> {item.name}</span>
                      <span className="font-bold">Rs. {item.price * item.quantity}</span>
                   </div>
                 ))}
                 <div className="pt-4 border-t border-white/5 flex justify-between font-display font-bold text-xl">
                    <span>TOTAL</span>
                    <span className="text-primary">Rs. {order.total}</span>
                 </div>
              </div>
           </div>

           {/* Delivery Info */}
           <div className="glass rounded-radius-3xl border border-white/5 p-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                 <MapPin size={20} className="text-primary" />
                 DELIVERY TO
              </h3>
              <div className="space-y-6">
                 <div>
                    <h4 className="font-bold mb-1">{order.customerName}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{order.address}</p>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-primary">
                       <Phone size={16} />
                    </div>
                    <span className="font-bold">{order.phone}</span>
                 </div>
                 {order.notes && (
                   <div className="p-4 bg-white/5 rounded-xl border-l-4 border-primary italic text-sm text-gray-400">
                      "{order.notes}"
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
             <Flame size={16} className="text-primary" /> 
             Estimated prep time: 25-35 mins
           </p>
        </div>
      </div>
    </div>
  );
}
