import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Truck, ShieldCheck, CreditCard } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#0C0C0C]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-display font-bold mb-4 tracking-tighter"
          >
            GET IN <span className="text-primary italic">TOUCH</span>
          </motion.h1>
          <p className="text-gray-400 text-xl font-light">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-radius-3xl border border-white/5">
              <h3 className="text-2xl font-bold mb-8 italic">Location & Hours</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Our Branch</h4>
                    <p className="text-gray-400 font-light">Plot #123, Sector 5-C/4, North Karachi, Karachi.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Service Hours</h4>
                    <p className="text-gray-400 font-light">Monday - Sunday: 12:00 PM - 02:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <p className="text-gray-400 font-light">+92 300 1234567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-radius-3xl border border-white/5">
              <h3 className="text-2xl font-bold mb-8 italic">Delivery Information</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Truck className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Fast Delivery</h4>
                    <p className="text-gray-400 font-light">Usually within 30-45 minutes in North Karachi area.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <ShieldCheck className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Safe Packing</h4>
                    <p className="text-gray-400 font-light">Steam-vented packaging to keep your food crispy and hot.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-10 rounded-radius-3xl border border-white/5 shadow-2xl"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Subject</label>
                <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-primary transition-all appearance-none">
                  <option>General Inquiry</option>
                  <option>Large Order Inquiry</option>
                  <option>Feedback & Suggestions</option>
                  <option>Complain</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Name</label>
                   <input type="text" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-primary" placeholder="Full Name" />
                </div>
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Email</label>
                   <input type="email" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-primary" placeholder="Email" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2 ml-1">Message</label>
                <textarea className="w-full min-h-32 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-primary" placeholder="How can we help you?" />
              </div>
              <button className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-light transition-all shadow-xl fire-glow">
                SEND MESSAGE
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
