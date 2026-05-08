import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Home from './Home';
import Menu from './Menu';
import About from './About';
import Reservations from './Reservations';
import Contact from './Contact';
import AdminDashboard from './AdminDashboard';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
import AdminReservations from './AdminReservations';
import AdminCustomers from './AdminCustomers';
import AdminPromotions from './AdminPromotions';
import AdminSettings from './AdminSettings';
import { ShoppingCart, Menu as MenuIcon, X, Phone, User, Settings as AdminIcon, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAdmin, login, logout } = useAuth();
  const { itemCount } = useCart();

  // Hidden navigation for Admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0C0C0C] font-sans selection:bg-primary selection:text-white">
      <Toaster position="top-center" />
      {/* Navigation */}
      {!isAdminPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:px-12 flex justify-between items-center transition-all duration-500 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5">
          <Link to="/" className="text-2xl font-display font-bold tracking-tighter flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
              <span className="text-white -rotate-12">P</span>
            </div>
            PARTY <span className="text-primary italic">FAST FOOD</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/menu" className="hover:text-primary transition-colors">Menu</Link>
            <Link to="/reservations" className="hover:text-primary transition-colors">Book a Table</Link>
            <motion.button 
              key={itemCount}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              className="p-3 glass rounded-full relative hover:border-primary transition-all group"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] font-bold flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">{itemCount}</span>
            </motion.button>
            {isAdmin && (
              <Link to="/admin" className="p-3 glass rounded-full hover:border-primary transition-all">
                <AdminIcon size={20} />
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400">{user.displayName}</span>
                  <button onClick={logout} className="text-[10px] text-primary hover:underline">Logout</button>
                </div>
                <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border border-primary/20" alt="Avatar" />
              </div>
            ) : (
              <button 
                onClick={login}
                className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-95"
              >
                Login
              </button>
            )}
          </div>

          <button 
            className="md:hidden p-3 glass rounded-full"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon size={24} />
          </button>
        </nav>
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 glass-dark z-[70] p-12 flex flex-col"
            >
              <button 
                className="absolute top-6 right-6 p-2 glass rounded-full"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col gap-8 text-2xl font-display mt-10">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="hover:text-primary">Home</Link>
                <Link to="/about" onClick={() => setIsSidebarOpen(false)} className="hover:text-primary">About</Link>
                <Link to="/menu" onClick={() => setIsSidebarOpen(false)} className="hover:text-primary">Menu</Link>
                <Link to="/reservations" onClick={() => setIsSidebarOpen(false)} className="hover:text-primary">Reservations</Link>
                <Link to="/contact" onClick={() => setIsSidebarOpen(false)} className="hover:text-primary">Contact</Link>
                {isAdmin && <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className="hover:text-primary">Admin</Link>}
              </div>

              <div className="mt-auto">
                {!user ? (
                  <button 
                    onClick={() => { login(); setIsSidebarOpen(false); }}
                    className="w-full py-4 bg-primary text-white font-bold rounded-radius-xl hover:bg-primary-light transition-all mb-4"
                  >
                    Login with Google
                  </button>
                ) : (
                  <button 
                    onClick={() => { logout(); setIsSidebarOpen(false); }}
                    className="w-full py-4 glass border-white/10 text-white font-bold rounded-radius-xl hover:bg-white/10 transition-all mb-4"
                  >
                    Logout
                  </button>
                )}
                <div className="flex items-center gap-2 text-gray-400 text-sm justify-center">
                  <Phone size={14} />
                  <span>+92 300 1234567</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/menu" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu />
                </motion.div>
              } 
            />
            <Route 
              path="/about" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <About />
                </motion.div>
              } 
            />
            <Route 
              path="/reservations" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Reservations />
                </motion.div>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Contact />
                </motion.div>
              } 
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/promotions" element={<AdminPromotions />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!isAdminPage && (
        <footer className="glass-dark border-t border-white/5 py-20">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-display font-bold mb-6 tracking-tighter">PARTY <span className="text-primary italic">FAST FOOD</span></h2>
              <p className="text-gray-400 max-w-sm mb-8">
                Deliciously crafted fast food with the authentic taste of Pakistan. We bring fire to your table.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
                <li><Link to="/reservations" className="hover:text-white transition-colors">Book a Table</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Delivery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3"><MapPin size={18} className="text-primary" /> Karachi, Pakistan</li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-primary" /> +92 300 1234567</li>
                <li className="flex items-center gap-3"><Clock size={18} className="text-primary" /> 12:00 PM - 02:00 AM</li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
            &copy; 2026 Party Fast Food. All Rights Reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
