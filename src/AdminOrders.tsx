import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FirebaseService } from './services/firebaseService';
import { Order } from './types';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Eye,
  ChevronDown
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const updateStatus = async (orderId: string, status: string) => {
    await FirebaseService.updateOrderStatus(orderId, status);
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400/10 text-yellow-400';
      case 'preparing': return 'bg-blue-400/10 text-blue-400';
      case 'out-for-delivery': return 'bg-purple-400/10 text-purple-400';
      case 'delivered': return 'bg-green-400/10 text-green-400';
      case 'cancelled': return 'bg-red-400/10 text-red-400';
      default: return 'bg-gray-400/10 text-gray-400';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Orders Management</h1>
            <p className="text-gray-500 mt-1">Monitor and manage customer orders in real-time.</p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 w-64 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 focus:outline-none focus:border-primary transition-all appearance-none"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </header>

        <div className="glass rounded-radius-3xl overflow-hidden border border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Total</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold">{order.name}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        getStatusColor(order.status)
                      )}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-display font-bold text-lg">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="p-2 bg-blue-400/10 text-blue-400 rounded-lg hover:bg-blue-400/20 transition-all"
                            title="Accept Order"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'out-for-delivery')}
                            className="p-2 bg-purple-400/10 text-purple-400 rounded-lg hover:bg-purple-400/20 transition-all"
                            title="Out for Delivery"
                          >
                            <Truck size={18} />
                          </button>
                        )}
                        {order.status === 'out-for-delivery' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'delivered')}
                            className="p-2 bg-green-400/10 text-green-400 rounded-lg hover:bg-green-400/20 transition-all"
                            title="Mark Delivered"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        <button 
                          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 italic">
                    {loading ? 'Loading orders...' : 'No orders found matching your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
