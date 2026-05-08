import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Menu as MenuIcon, User, Search, MapPin, Clock, Phone } from 'lucide-react';
import { cn } from './lib/utils';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0 scale-110"
          animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000" 
            alt="BBQ Fire" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-4 tracking-tighter leading-none"
              initial={{ letterSpacing: "-0.05em" }}
              animate={{ letterSpacing: "0.02em" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              PARTY <span className="text-primary italic animate-pulse">FAST FOOD</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Experience the fire of premium Pakistani street food. Bold, spicy, and crafted for the bold.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="px-10 py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-light transition-all shadow-xl fire-glow"
              >
                Order Now
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="px-10 py-5 glass border-white/10 text-white rounded-full font-bold text-lg transition-all"
              >
                Explore Menu
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute top-1/4 left-10 w-24 h-24 bg-primary/20 blur-3xl rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"
          animate={{ scale: [1.5, 1, 1.5], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </section>

      {/* Featured Categories */}
      <section className="py-32 container mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-display font-bold mb-16 flex items-center gap-6">
            <span className="w-20 h-[3px] bg-primary rounded-full" />
            OUR SPECIALTIES
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { name: 'GRILL & BBQ', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', desc: 'Smoky, fire-grilled perfection.' },
             { name: 'ZINGER BURGERS', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', desc: 'The crunch that started it all.' },
             { name: 'HANDI & KARAHI', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800', desc: 'Traditional flavors in every bite.' },
             { name: 'PIZZA & ROLLS', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', desc: 'Cheesy goodness for the soul.' }
           ].map((cat, i) => (
             <motion.div 
                key={cat.name} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate('/menu')}
                className="glass rounded-radius-3xl overflow-hidden group cursor-pointer h-[400px] relative border border-white/5"
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-xl font-bold mb-2 tracking-tight">{cat.name}</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">{cat.desc}</p>
                  <div className="mt-4 w-10 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
                </div>
             </motion.div>
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
