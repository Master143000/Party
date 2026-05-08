import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, Phone, Mail, User } from 'lucide-react';
import { FirebaseService } from './services/firebaseService';
import { toast } from 'react-hot-toast';

export default function Reservations() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await FirebaseService.makeReservation(formData as any);
      toast.success('Reservation requested! We will call you to confirm.', {
        style: { background: '#333', color: '#fff', border: '1px solid #FF5C00' }
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0C0C0C]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-display font-bold mb-6 tracking-tighter">
              BOOK A <span className="text-primary italic">TABLE</span>
            </h1>
            <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed">
              Planning a party or a family dinner? Reserve your spot at Party Fast Food. 
              Enjoy our fiery BBQ in a cozy, modern atmosphere.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Call Us Directly</h4>
                  <p className="text-gray-400">+92 300 1234567</p>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Opening Hours</h4>
                  <p className="text-gray-400">12:00 PM - 02:00 AM (Mon - Sun)</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-radius-3xl border border-white/5 relative bg-white/2 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 focus:outline-none focus:border-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                 </div>
                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 focus:outline-none focus:border-primary transition-all"
                        placeholder="+92 XXX XXXXXXX"
                      />
                    </div>
                 </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 focus:outline-none focus:border-primary transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Select Date</label>
                   <input 
                    required
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-primary transition-all text-gray-400"
                   />
                </div>
                <div>
                   <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Select Time</label>
                   <input 
                    required
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-primary transition-all text-gray-400"
                   />
                </div>
              </div>

              <div>
                 <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Number of Guests</label>
                 <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select 
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    </select>
                 </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-light transition-all shadow-xl fire-glow flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? 'Requesting...' : 'REQUEST BOOKING'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
