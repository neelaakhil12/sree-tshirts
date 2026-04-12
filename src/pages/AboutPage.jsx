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
                src="/images/products/pure-cotton-bio-washed/black.png" 
                alt="Our Story"
                className="w-full h-auto shadow-premium" 
              />
           </div>
           <div className="space-y-8" data-aos="fade-left">
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-tight">
                 THE WEAR <span className="text-accent">MINGLE</span> <br /> LEGACY.
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                 <p>
                    Founded in the heart of Nandyal and Bangalore that fashion should be a perfect blend of style and ease. Under the visionary leadership of SRIKANTH G and VENKATASIVA CM, our journey began as a dedicated local store and has now evolved into Wear Mingle a dynamic online destination for the modern wardrobe.
                 </p>
                 <p>
                    At Wear Mingle, we don't just sell clothes; we deliver confidence. We specialize in premium cotton T-shirts crafted with precision. Each piece is bio-washed for ultimate softness and pre-shrunk to ensure a perfect fit that lasts, wash after wash. Driven by the passion of our founders, we are committed to bringing you high-quality essentials that feel as good as they look.
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
