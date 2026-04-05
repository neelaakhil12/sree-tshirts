import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Heart, Zap, Award } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="pt-28 bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-24 bg-black text-white px-4">
        <div className="container mx-auto text-center space-y-8" data-aos="fade-up">
           <span className="text-accent font-black tracking-widest text-xs sm:text-sm uppercase">WHO WE ARE</span>
           <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
             NOT JUST A BRAND. <br /> A <span className="text-accent">MINGLE.</span>
           </h1>
           <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-medium">
             Wear Mingle is a fashion destination where comfort meets style. Born from a vision to provide premium quality T-shirts at affordable prices.
           </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-24 px-4 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
           <div data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Story"
                className="w-full h-auto shadow-premium" 
              />
           </div>
           <div className="space-y-8" data-aos="fade-left">
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-tight">
                 THE SREE SAI <br /> APPAREL <span className="text-accent">LEGACY.</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                 <p>
                    Founded in Nandyal, Sree Sai Apparels started with a simple belief: everyone deserves to look good without compromising on comfort. Under the leadership of Srikanth, we’ve grown from a local store to a dynamic online platform: Wear Mingle.
                 </p>
                 <p>
                    We specialize in premium cotton T-shirts that are bio-washed and pre-shrunk to ensure they feel as good as they look, even after many washes.
                 </p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8">
                 <div>
                    <span className="block text-4xl font-black text-black">100%</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Cotton</span>
                 </div>
                 <div>
                    <span className="block text-4xl font-black text-black">10K+</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Happy Hearts</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-24 bg-gray-50 px-4">
        <div className="container mx-auto">
           <div className="text-center mb-16" data-aos="fade-up">
              <h3 className="text-3xl font-black uppercase tracking-tight">WHY CHOOSE US</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: Sparkles, title: 'Quality First', desc: 'Every fabric is handpicked and undergoes strict quality checks.' },
                { icon: Heart, title: 'Made with Love', desc: 'Our designs are inspired by people, for people.' },
                { icon: Zap, title: 'Fast Delivery', desc: 'We value your time and ensure prompt shipping.' },
                { icon: Award, title: 'Best Value', desc: 'Premium style that doesn’t break your bank account.' },
              ].map((v, i) => (
                <div key={i} className="bg-white p-10 space-y-4 shadow-premium hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up" data-aos-delay={i*100}>
                   <div className="w-16 h-16 bg-accent/10 flex items-center justify-center rounded-2xl text-accent mb-6">
                      <v.icon size={32} />
                   </div>
                   <h4 className="text-xl font-black uppercase tracking-widest">{v.title}</h4>
                   <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-24 px-4 text-center">
         <div className="container mx-auto bg-black p-10 sm:p-20 relative overflow-hidden" data-aos="zoom-in">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:40px_40px]"></div>
            </div>
            <h3 className="text-white text-2xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-10 relative z-10 uppercase tracking-tighter">
               Ready to upgrade your <br /> wardrobe?
            </h3>
            <Link 
              to="/products"
              className="inline-block bg-accent text-white px-8 sm:px-12 py-4 sm:py-5 font-black text-xs sm:text-base uppercase tracking-widest relative z-10 transform hover:scale-110 hover:-rotate-2 transition-all shadow-xl"
            >
              Start Mingling
            </Link>
         </div>
      </section>
    </div>
  )
}

export default AboutPage
