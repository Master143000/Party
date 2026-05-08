import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FirebaseService } from './services/firebaseService';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminCustomers() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const filteredCustomers = customers.filter(c => 
    c.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Customer Database</h1>
            <p className="text-gray-500 mt-1">View and manage your registered customer community.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 w-80 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <motion.div 
                layout
                key={customer.id}
                className="glass p-8 rounded-radius-3xl border border-white/5 group relative"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <img 
                      src={customer.photoURL || 'https://via.placeholder.com/100'} 
                      alt={customer.displayName}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10 group-hover:border-primary transition-colors"
                    />
                    {customer.isAdmin && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-[#080808]">
                        ADMIN
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate group-hover:text-primary transition-colors">{customer.displayName}</h3>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <ShoppingBag size={14} className="shrink-0" />
                        <span>Member since {new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                   <div className="p-4 bg-white/5 rounded-2xl text-center">
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Orders</p>
                     <p className="text-xl font-display font-bold">0</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl text-center">
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Spent</p>
                     <p className="text-xl font-display font-bold">Rs. 0</p>
                   </div>
                </div>

                <button className="w-full mt-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-bold">
                   <ExternalLink size={16} /> View Profile
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 italic">
               {loading ? 'Loading customers...' : 'No customers found.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
