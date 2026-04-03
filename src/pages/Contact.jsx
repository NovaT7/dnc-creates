import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subjectQuery = queryParams.get('subject') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: subjectQuery ? 'Custom Order' : 'General Enquiry',
    message: subjectQuery ? `I am interested in a custom order related to: ${subjectQuery.replace('Custom Order Enquiry: ', '')}` : ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'Unread'
      });
      
      setIsSuccess(true);
      
      // Fallback native email trigger (optional, user requested "sends email to owner")
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(formData.type)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`)}`;
      window.location.href = mailtoLink;

      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'General Enquiry',
        message: ''
      });
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-champagne py-16 text-center border-b border-rose-gold/20">
        <h1 className="text-5xl text-deep-brown mb-4">Get in Touch</h1>
        <div className="ornament"></div>
        <p className="font-body tracking-widest uppercase text-sm text-deep-brown/70 mt-4">
          We'd love to hear from you
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Information */}
          <div className="lg:col-span-4 flex flex-col space-y-12">
            <div>
              <h2 className="font-display text-3xl text-deep-brown mb-6">Contact Information</h2>
              <p className="font-body text-deep-brown/70 leading-relaxed mb-8">
                Whether you have a question about our pieces, need help with an order, or want to discuss a custom design, our team is here to assist you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-rose-gold" />
                  </div>
                  <div>
                    <h4 className="font-body uppercase tracking-wider text-xs font-medium text-deep-brown/60 mb-1">Email</h4>
                    <a href="mailto:hello@dnccreates.com" className="font-body text-deep-brown hover:text-rose-gold transition-colors">hello@dnccreates.com</a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-rose-gold" />
                  </div>
                  <div>
                    <h4 className="font-body uppercase tracking-wider text-xs font-medium text-deep-brown/60 mb-1">Phone / WhatsApp</h4>
                    <a href="tel:+919876543210" className="font-body text-deep-brown hover:text-rose-gold transition-colors">+91 98765 43210</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-rose-gold" />
                  </div>
                  <div>
                    <h4 className="font-body uppercase tracking-wider text-xs font-medium text-deep-brown/60 mb-1">Working Hours</h4>
                    <p className="font-body text-deep-brown">Mon - Sat: 10AM - 6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-rose-gold" />
                  </div>
                  <div>
                    <h4 className="font-body uppercase tracking-wider text-xs font-medium text-deep-brown/60 mb-1">Studio Location</h4>
                    <p className="font-body text-deep-brown">Mumbai, India<br/>(Studio visits by appointment only)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-12 border border-rose-gold/20 shadow-sm relative overflow-hidden">
              
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <CheckCircle size={64} className="text-green-500 mb-6" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="font-display text-3xl text-deep-brown mb-2">Message Sent!</h3>
                    <p className="font-body text-deep-brown/70 max-w-sm">
                      Thank you for reaching out. We will get back to you within 24-48 business hours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="font-display text-3xl text-deep-brown mb-8">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-body text-xs uppercase tracking-wider text-deep-brown/70 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-soft-white border border-rose-gold/30 px-4 py-3 font-body text-deep-brown focus:outline-none focus:border-rose-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-body text-xs uppercase tracking-wider text-deep-brown/70 mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-soft-white border border-rose-gold/30 px-4 py-3 font-body text-deep-brown focus:outline-none focus:border-rose-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block font-body text-xs uppercase tracking-wider text-deep-brown/70 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-soft-white border border-rose-gold/30 px-4 py-3 font-body text-deep-brown focus:outline-none focus:border-rose-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block font-body text-xs uppercase tracking-wider text-deep-brown/70 mb-2">Enquiry Type *</label>
                    <select 
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-soft-white border border-rose-gold/30 px-4 py-3 font-body text-deep-brown focus:outline-none focus:border-rose-gold transition-colors appearance-none"
                    >
                      <option>General Enquiry</option>
                      <option>Custom Order</option>
                      <option>Order Status</option>
                      <option>Return/Exchange</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-xs uppercase tracking-wider text-deep-brown/70 mb-2">Your Message *</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-soft-white border border-rose-gold/30 px-4 py-3 font-body text-deep-brown focus:outline-none focus:border-rose-gold transition-colors resize-y"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`btn-primary w-full md:w-auto ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
