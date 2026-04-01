import React from 'react';
import { motion } from 'framer-motion';
import logo1 from '../assets/images/logo1.webp';

export default function About() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-champagne py-16 text-center border-b border-rose-gold/20">
        <h1 className="text-5xl text-deep-brown mb-4">Our Story</h1>
        <div className="ornament"></div>
        <p className="font-body tracking-widest uppercase text-sm text-deep-brown/70 mt-4">
          The art of handcrafted elegance
        </p>
      </header>

      {/* Brand Story */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 md:order-1 flex flex-col justify-center">
            <h2 className="font-display text-4xl text-deep-brown mb-6">Born from a Passion for Perfection</h2>
            <div className="w-12 h-[1px] bg-rose-gold mb-8"></div>
            
            <div className="space-y-6 font-body text-deep-brown/80 leading-relaxed">
              <p>
                DNC Creates began as a small vision: to craft beautiful, meaningful pieces of jewellery that celebrate the wearer's unique journey. We believe that true luxury lies not in mass production, but in the careful, intentional crafting of individual pieces.
              </p>
              <p>
                From delicate diamond rings to intricately engraved lockets, each creation is a testament to our dedication to traditional craftsmanship blended with modern aesthetics. 
              </p>
              <p>
                We source only premium materials, ensuring that every ring, locket, keychain, and bracelet isn't just an accessory, but a keepsake to be treasured for generations.
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="glass-card p-12 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-rose-gold/5 transform rotate-3 -z-10 group-hover:rotate-6 transition-transform duration-500"></div>
              <img 
                src={logo1} 
                alt="DNC Creates Logo" 
                className="w-full max-w-md drop-shadow-xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Mission / Vision / Promise */}
      <section className="bg-deep-brown py-24 text-champagne">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-champagne mb-4">Our Core Values</h2>
            <div className="ornament mb-0"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-Champagne/5 border border-rose-gold/30 p-10 text-center"
            >
              <h3 className="font-display text-3xl text-rose-gold-light mb-4">Our Mission</h3>
              <p className="font-body text-champagne/80 leading-relaxed text-sm">
                To handcraft timeless, elegant jewellery that makes everyday moments feel extraordinary and celebrates the uniqueness of every individual.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-Champagne/5 border border-rose-gold/30 p-10 text-center"
            >
              <h3 className="font-display text-3xl text-rose-gold-light mb-4">Our Vision</h3>
              <p className="font-body text-champagne/80 leading-relaxed text-sm">
                To be the most loved destination for bespoke and handcrafted accessories, known worldwide for our unmatched quality and heartfelt service.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-Champagne/5 border border-rose-gold/30 p-10 text-center"
            >
              <h3 className="font-display text-3xl text-rose-gold-light mb-4">Our Promise</h3>
              <p className="font-body text-champagne/80 leading-relaxed text-sm">
                We promise uncompromising quality, ethical sourcing of materials, and an unwavering commitment to bringing your dream designs to life.
              </p>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
