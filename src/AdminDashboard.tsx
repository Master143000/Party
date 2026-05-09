import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FirebaseService } from './services/firebaseService';
import { 
  ShoppingBag, 
  Users, 
  Calendar, 
  TrendingUp,
  ChevronRight,
  Clock
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { db } from './firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { Order } from './types';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    reservations: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Latest 5 orders
    const q = query(
      collection(db, 'orders'), 
      orderBy('createdAt', 'desc'), 
      limit(5)
    );
    
    const unsubscribe = onSnapshot(q, (snap) => {
      setRecentOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });

    // Real-time stats calculation (simplified for now)
    const qAll = query(collection(db, 'orders'));
    const unsubscribeStats = onSnapshot(qAll, (snap) => {
      const orders = snap.docs.map(d => d.data() as Order);
      const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
      const uniqueCustomers = new Set(orders.map(o => o.userId)).size;
      
      setStats(prev => ({
        ...prev,
        orders: orders.length,
        revenue: totalRevenue,
        customers: uniqueCustomers
      }));
    });

    return () => {
      unsubscribe();
      unsubscribeStats();
    };
  }, [isAdmin, navigate]);

  const dashboardStats = [
    { label: 'Total Orders', value: stats.orders.toString(), icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Customers', value: stats.customers.toString(), icon: Users, color: 'text-purple-400' },
    { label: 'Reservations', value: '0', icon: Calendar, color: 'text-primary' },
  ];

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      <AdminSidebar />

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
          {dashboardStats.map((stat, i) => (
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
            <button className="text-primary text-sm font-bold hover:underline" onClick={() => navigate('/admin/orders')}>View All</button>
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
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-5 font-mono text-xs text-gray-500">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-sm">{order.customerName}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.items.slice(0, 2).map((item, i) => (
                            <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-[10px] text-gray-600">+{order.items.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight",
                          order.status === 'pending' ? "bg-yellow-400/10 text-yellow-400" :
                          order.status === 'preparing' ? "bg-blue-400/10 text-blue-400" :
                          order.status === 'out-for-delivery' ? "bg-purple-400/10 text-purple-400" :
                          "bg-green-400/10 text-green-400"
                        )}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-400 uppercase font-black">
                        {order.type}
                      </td>
                      <td className="px-6 py-5 font-bold">
                        Rs. {order.total}
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => navigate('/admin/orders')}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-primary"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500 italic">
                      No active orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
