import { motion } from 'motion/react';
import { ChefHat, Flame, History, Award, Users, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
            alt="Chef Cooking" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-bold mb-4 tracking-tighter"
          >
            OUR <span className="text-primary italic">STORY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto font-light"
          >
            From a small street-side grill to North Karachi's legendary flavor destination.
          </motion.p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <History className="text-primary" size={32} />
              <span className="text-primary font-black tracking-widest uppercase text-sm">Born in 2010</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              A Legacy Built on <br />
              <span className="text-primary">Fire & Flavor</span>
            </h2>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                Party Fast Food started with a simple observation: Pakistani street food deserves the premium treatment. We didn't just want to make burgers; we wanted to create an experience that captured the energy of Karachi's nights.
              </p>
              <p>
                Our signature Zinger didn't happen overnight. It took 14 months of experimenting with spice blends, breading techniques, and temperature controls to achieve that "perfect crunch" that our fans talk about today.
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="aspect-square rounded-radius-3xl overflow-hidden fire-glow">
              <img 
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000" 
                alt="Our First Shop" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Experience badge */}
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-radius-2xl border border-white/10 shadow-2xl">
              <div className="text-5xl font-display font-bold text-primary mb-1">14+</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400">Years of Excellence</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-6 text-center mb-20">
          <h2 className="text-4xl font-display font-bold mb-6">WHAT WE STAND FOR</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Heart, title: "Fresh Every Day", desc: "We never use frozen patties. Our chicken is hand-breaded and prepared fresh for every single order." },
            { icon: Flame, title: "Signature Spices", desc: "Our secret 12-spice blend is made in-house to ensure that authentic Party flavor you won't find anywhere else." },
            { icon: Users, title: "The North Karachi Spirit", desc: "We started as a local favorite and aim to treat every customer like a neighbor." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-radius-3xl border border-white/5 hover:border-primary/30 transition-all group"
            >
              <item.icon className="text-primary mb-6 transition-transform group-hover:scale-110" size={40} />
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 container mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto"
        >
          <Award className="text-primary mx-auto mb-8" size={64} />
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-12 italic leading-tight">
            "We don't just sell food, <br />
            we fuel <span className="text-primary">moments worth celebrating</span>."
          </h2>
          <p className="text-2xl text-gray-500 font-display">
            — Shakeel Ahmed, Founder
          </p>
        </motion.div>
      </section>
    </div>
  );
}
