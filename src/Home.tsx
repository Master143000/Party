import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Menu as MenuIcon, User, Search, MapPin, Clock, Phone } from 'lucide-react';
import { cn } from './lib/utils';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000" 
            alt="BBQ Fire" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-4 tracking-tighter">
              PARTY <span className="text-primary italic">FAST FOOD</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
              Experience the fire of premium Pakistani street food. Bold, spicy, and unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/menu')}
                className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-light transition-all transform hover:scale-105 active:scale-95"
              >
                Order Now
              </button>
              <button 
                onClick={() => navigate('/menu')}
                className="px-8 py-4 glass border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
              >
                View Menu
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Sections placeholder */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-display font-bold mb-12 flex items-center gap-3">
          <span className="w-12 h-[2px] bg-primary" />
          POPULAR FAVORITES
        </h2>
        {/* Placeholder for trending slider */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3].map((i) => (
             <div key={i} className="glass rounded-radius-2xl overflow-hidden group cursor-pointer h-96 relative">
                <img 
                  src={`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800`} 
                  alt="Food" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold mb-1">Double Zinger Cheese</h3>
                  <p className="text-primary font-bold">Rs. 530</p>
                </div>
             </div>
           ))}
        </div>
      </section>
      
      {/* Sticky Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="glass-dark rounded-full p-2 flex justify-between items-center shadow-2xl">
          <button onClick={() => navigate('/')} className="p-4 bg-primary rounded-full text-white">
            <User size={24} />
          </button>
          <button onClick={() => navigate('/menu')} className="p-4">
             <MenuIcon size={24} />
          </button>
          <button onClick={() => navigate('/cart')} className="p-4 bg-white/10 rounded-full relative">
             <ShoppingCart size={24} />
             <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-[10px] flex items-center justify-center rounded-full">0</span>
          </button>
        </div>
      </div>
    </div>
  );
}
