import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FirebaseService } from './services/firebaseService';
import { 
  ShoppingBag, 
  Users, 
  Calendar, 
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const stats = [
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Revenue', value: 'Rs. 0', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Customers', value: '0', icon: Users, color: 'text-purple-400' },
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
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500 italic">
                    No active orders found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
