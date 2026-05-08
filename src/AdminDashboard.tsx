import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FirebaseService } from './services/firebaseService';
import { CATEGORIES, PRODUCTS } from './data';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { 
  BarChart3, 
  ShoppingBag, 
  UtensilsCrossed, 
  Users, 
  Calendar, 
  Tag, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isSeeding, setIsSeeding] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleSeed = async () => {
    if (!confirm('This will wipe menu and re-seed from static data. Continue?')) return;
    setIsSeeding(true);
    try {
      // Clear existing
      const catSnap = await getDocs(collection(db, 'menu_categories'));
      for (const d of catSnap.docs) await deleteDoc(doc(db, 'menu_categories', d.id));
      const itemSnap = await getDocs(collection(db, 'menu_items'));
      for (const d of itemSnap.docs) await deleteDoc(doc(db, 'menu_items', d.id));

      // Seed categories
      for (const cat of CATEGORIES) {
        await addDoc(collection(db, 'menu_categories'), cat);
      }
      // Seed items
      for (const prod of PRODUCTS) {
        await addDoc(collection(db, 'menu_items'), prod);
      }
      alert('Seeding complete!');
    } catch (e) {
      console.error(e);
      alert('Error seeding data');
    } finally {
      setIsSeeding(false);
    }
  };

  const stats = [
    { label: 'Total Orders', value: '1,280', icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Revenue', value: 'Rs. 450k', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Customers', value: '840', icon: Users, color: 'text-purple-400' },
    { label: 'Reservations', value: '12', icon: Calendar, color: 'text-primary' },
  ];

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
           <h2 className="text-xl font-display font-bold text-primary">ADMIN PANEL</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '5' },
            { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
            { id: 'reservations', label: 'Bookings', icon: Calendar },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'coupons', label: 'Promotions', icon: Tag },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                activeTab === item.id ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-full",
                  activeTab === item.id ? "bg-white text-primary" : "bg-primary text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-white/5">
            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="w-full flex items-center gap-3 p-3 text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-50"
            >
              <Database size={20} />
              <span className="font-medium">{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 transition-colors w-full">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold">Good Morning, Admin</h1>
            <p className="text-gray-400 mt-1">Here is what is happening today.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="font-bold">Shehbaz Admin</p>
                <p className="text-xs text-primary">Store Owner</p>
             </div>
             <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl">
               SA
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders Table placeholder */}
        <div className="glass rounded-radius-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg">Active Orders</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold font-display">Order ID</th>
                  <th className="px-6 py-4 font-bold font-display">Customer</th>
                  <th className="px-6 py-4 font-bold font-display">Status</th>
                  <th className="px-6 py-4 font-bold font-display">Type</th>
                  <th className="px-6 py-4 font-bold font-display">Amount</th>
                  <th className="px-6 py-4 font-bold font-display">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: '#PF-9281', name: 'Zeeshan Ali', status: 'preparing', type: 'Delivery', amount: 'Rs. 1,250' },
                  { id: '#PF-9282', name: 'Farhan Khan', status: 'pending', type: 'Dine-in', amount: 'Rs. 850' },
                  { id: '#PF-9283', name: 'Sara Malik', status: 'out-for-delivery', type: 'Delivery', amount: 'Rs. 2,100' },
                  { id: '#PF-9284', name: 'Omar Javed', status: 'delivered', type: 'Takeaway', amount: 'Rs. 530' },
                ].map((order) => (
                  <tr key={order.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.name}</p>
                      <p className="text-xs text-gray-500">+92 300 0000000</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                        order.status === 'preparing' && "bg-blue-400/10 text-blue-400",
                        order.status === 'pending' && "bg-yellow-400/10 text-yellow-400",
                        order.status === 'out-for-delivery' && "bg-purple-400/10 text-purple-400",
                        order.status === 'delivered' && "bg-green-400/10 text-green-400",
                      )}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{order.type}</td>
                    <td className="px-6 py-4 font-bold">{order.amount}</td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
