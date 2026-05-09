import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Home from './Home';
import Menu from './Menu';
import About from './About';
import Reservations from './Reservations';
import Contact from './Contact';
import CheckoutPage from './CheckoutPage';
import OrderTracker from './OrderTracker';
import UserOrders from './UserOrders';
import AdminDashboard from './AdminDashboard';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
import AdminReservations from './AdminReservations';
import AdminCustomers from './AdminCustomers';
import AdminPromotions from './AdminPromotions';
import AdminSettings from './AdminSettings';
import { ShoppingCart, Menu as MenuIcon, X, Phone, User, Settings as AdminIcon, MapPin, Clock, Home as HomeIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { Toaster } from 'react-hot-toast';
import { cn } from './lib/utils';

export default function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAdmin, login, logout } = useAuth();
  const { itemCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  // Hidden navigation for Admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0C0C0C] font-sans selection:bg-primary selection:text-white">
      <Toaster position="top-center" />
      {/* Navigation */}
      {!isAdminPage && (
        <nav className="fixed top-0 left-0 right-0 z-[100] p-6 md:px-12 flex justify-between items-center transition-all duration-500 bg-black/90 backdrop-blur-md border-b border-white/10">
          <Link to="/" className="text-2xl font-display font-bold tracking-tighter flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-[0_0_20px_rgba(255,92,0,0.3)]">
              <span className="text-white -rotate-12 font-black">P</span>
            </div>
            <span className="group-hover:text-primary transition-colors">PARTY <span className="text-primary italic">FAST FOOD</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className={cn("transition-all font-bold uppercase text-[11px] tracking-[0.2em]", isActive('/') ? "text-primary" : "text-gray-400 hover:text-white")}>Home</Link>
            <Link to="/menu" className={cn("transition-all font-bold uppercase text-[11px] tracking-[0.2em]", isActive('/menu') ? "text-primary" : "text-gray-400 hover:text-white")}>Menu</Link>
            <Link to="/about" className={cn("transition-all font-bold uppercase text-[11px] tracking-[0.2em]", isActive('/about') ? "text-primary" : "text-gray-400 hover:text-white")}>About</Link>
            <Link to="/reservations" className={cn("transition-all font-bold uppercase text-[11px] tracking-[0.2em]", isActive('/reservations') ? "text-primary" : "text-gray-400 hover:text-white")}>Reservations</Link>
            <Link to="/contact" className={cn("transition-all font-bold uppercase text-[11px] tracking-[0.2em]", isActive('/contact') ? "text-primary" : "text-gray-400 hover:text-white")}>Contact</Link>
            
            {user && (
              <Link to="/orders" className={cn("transition-all font-bold uppercase text-[11px] tracking-[0.2em]", isActive('/orders') ? "text-primary" : "text-gray-400 hover:text-white")}>My Orders</Link>
            )}
            
            <div className="w-[1px] h-4 bg-white/10 mx-2" />

            <Link to="/checkout" className="relative group">
              <motion.div 
                key={itemCount}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                className={cn(
                  "p-3 glass rounded-full relative transition-all border",
                  isActive('/checkout') ? "border-primary text-primary bg-primary/5" : "border-white/5 text-white hover:border-primary/50"
                )}
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] font-black flex items-center justify-center rounded-full shadow-lg ring-2 ring-black">{itemCount}</span>
                )}
              </motion.div>
            </Link>

            {isAdmin && (
              <Link to="/admin" className={cn("p-3 glass rounded-full transition-all border", isActive('/admin') ? "border-primary text-primary" : "border-white/5 text-white hover:border-primary")}>
                <AdminIcon size={18} />
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
                <div className="relative group">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-right hidden lg:block">
                      <p className="text-[10px] font-black text-white uppercase tracking-wider">{user.displayName}</p>
                      <p className="text-[8px] text-primary font-bold">VIP CRAVER</p>
                    </div>
                    <img src={user.photoURL || ''} className="w-9 h-9 rounded-full border-2 border-white/5 group-hover:border-primary transition-colors" alt="Avatar" />
                  </div>
                  <div className="absolute top-12 right-0 bg-[#141414] border border-white/10 p-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto whitespace-nowrap z-[110] shadow-2xl min-w-[150px]">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-[10px] font-black text-white">{user.displayName}</p>
                      <p className="text-[9px] text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/orders" className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                      <ShoppingCart size={12} /> My Orders
                    </Link>
                    <button 
                      onClick={logout} 
                      className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-xl text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Phone size={12} className="rotate-[135deg]" /> LOGOUT
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={login}
                className="px-8 py-2.5 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20"
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
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors", isActive('/') ? "text-primary italic" : "text-white")}>Home</Link>
                <Link to="/menu" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors", isActive('/menu') ? "text-primary italic" : "text-white")}>Menu</Link>
                <Link to="/about" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors", isActive('/about') ? "text-primary italic" : "text-white")}>About</Link>
                <Link to="/reservations" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors", isActive('/reservations') ? "text-primary italic" : "text-white")}>Reservations</Link>
                <Link to="/contact" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors", isActive('/contact') ? "text-primary italic" : "text-white")}>Contact</Link>
                {user && (
                  <Link to="/orders" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors", isActive('/orders') ? "text-primary italic" : "text-white")}>My Orders</Link>
                )}
                <Link to="/checkout" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors flex items-center gap-4", isActive('/checkout') ? "text-primary italic" : "text-white")}>
                  Cart 
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-lg">{itemCount}</span>
                </Link>
                {isAdmin && <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className={cn("transition-colors", isActive('/admin') ? "text-primary italic" : "text-white")}>Admin</Link>}
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

      <main className={cn(!isAdminPage && "pb-32 md:pb-0")}>
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
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track/:id" element={<OrderTracker />} />
            <Route path="/orders" element={<UserOrders />} />
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

      {/* Global Bottom Navigation (Mobile Only) */}
      {!isAdminPage && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-dark border border-white/10 rounded-full p-2 flex justify-between items-center shadow-2xl backdrop-blur-xl"
          >
            <Link 
              to="/" 
              className={cn(
                "p-4 rounded-full transition-all flex items-center justify-center relative",
                isActive('/') ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-gray-400"
              )}
            >
              <HomeIcon size={20} />
              {isActive('/') && (
                <motion.span 
                  layoutId="activeBubble"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </Link>

            <Link 
              to="/menu" 
              className={cn(
                "p-4 rounded-full transition-all flex items-center justify-center relative",
                isActive('/menu') ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-gray-400"
              )}
            >
              <MenuIcon size={20} />
              {isActive('/menu') && (
                <motion.span 
                  layoutId="activeBubble"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </Link>

            <Link 
              to="/reservations" 
              className={cn(
                "p-4 rounded-full transition-all flex items-center justify-center relative",
                isActive('/reservations') ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-gray-400"
              )}
            >
              <Clock size={20} />
              {isActive('/reservations') && (
                <motion.span 
                  layoutId="activeBubble"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </Link>

            <Link 
              to="/checkout" 
              className={cn(
                "p-4 rounded-full transition-all flex items-center justify-center relative",
                isActive('/checkout') ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-gray-400"
              )}
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-primary text-[10px] font-black flex items-center justify-center rounded-full shadow-md">
                    {itemCount}
                  </span>
                )}
              </div>
              {isActive('/checkout') && (
                <motion.span 
                  layoutId="activeBubble"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </Link>
          </motion.div>
        </div>
      )}

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
