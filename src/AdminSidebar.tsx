import { motion } from 'motion/react';
import { 
  BarChart3, 
  ShoppingBag, 
  UtensilsCrossed, 
  Users, 
  Calendar, 
  Tag, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed, path: '/admin/menu' },
    { id: 'reservations', label: 'Bookings', icon: Calendar, path: '/admin/reservations' },
    { id: 'customers', label: 'Customers', icon: Users, path: '/admin/customers' },
    { id: 'coupons', label: 'Promotions', icon: Tag, path: '/admin/promotions' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 glass-dark border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
      <div className="p-8">
         <h2 className="text-xl font-display font-bold text-primary tracking-tighter">ADMIN <span className="italic">PANEL</span></h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-xl transition-all relative group overflow-hidden",
              location.pathname === item.path ? "text-white" : "text-gray-400 hover:text-white"
            )}
          >
            {location.pathname === item.path && (
              <motion.div 
                layoutId="sidebarActiveHighlight"
                className="absolute inset-0 bg-primary -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-full",
                location.pathname === item.path ? "bg-white text-primary" : "bg-primary text-white"
              )}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 p-3 text-gray-400 hover:text-primary transition-colors w-full"
        >
          <ChevronRight className="rotate-180" size={20} />
          <span>Return to Site</span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
