import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FirebaseService } from './services/firebaseService';
import { Reservation } from './types';
import { 
  Calendar, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Phone,
  Mail,
  Trash2
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { onSnapshot, collection, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminReservations() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setReservations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Reservation)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'reservations', id), { status });
  };

  const deleteReservation = async (id: string) => {
    if (confirm('Delete this reservation?')) {
      await deleteDoc(doc(db, 'reservations', id));
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesFilter = filter === 'All' || res.status === filter;
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#080808] text-white">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Table Bookings</h1>
            <p className="text-gray-500 mt-1">Manage and confirm restaurant table reservations.</p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search bookings..." 
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
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((res) => (
              <motion.div 
                layout
                key={res.id}
                className="glass p-6 rounded-radius-3xl border border-white/5 flex flex-col gap-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{res.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Users size={14} />
                      <span>{res.guests} Guests</span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                    res.status === 'confirmed' ? "bg-green-400/10 text-green-400" :
                    res.status === 'pending' ? "bg-yellow-400/10 text-yellow-400" :
                    "bg-red-400/10 text-red-400"
                  )}>
                    {res.status}
                  </span>
                </div>

                <div className="space-y-3 py-4 border-y border-white/5">
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                     <Calendar size={16} className="text-primary" />
                     <span>{res.date}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                     <Clock size={16} className="text-primary" />
                     <span>{res.time}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                     <Phone size={16} className="text-primary" />
                     <span>{res.phone}</span>
                   </div>
                </div>

                <div className="flex gap-2">
                  {res.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(res.id, 'confirmed')}
                      className="flex-1 py-3 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Confirm
                    </button>
                  )}
                  {res.status !== 'cancelled' && (
                    <button 
                      onClick={() => updateStatus(res.id, 'cancelled')}
                      className="flex-1 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  )}
                  <button 
                    onClick={() => deleteReservation(res.id)}
                    className="p-3 bg-white/5 text-gray-400 hover:text-red-400 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 italic">
               {loading ? 'Loading bookings...' : 'No reservations found.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
