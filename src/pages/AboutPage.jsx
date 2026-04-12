import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Heart, Zap, Award } from 'lucide-react'

const CATALOG_INDEX = [
  { id: '04', name: 'Polyester Round Neck Promotional T-shirt' },
  { id: '05', name: 'Polyester Round Neck GYM T-shirt' },
  { id: '06', name: 'Premium Polyester Round Neck T-shirt' },
  { id: '07', name: 'Selina Round Neck T-shirt' },
  { id: '08', name: 'Polyester Honey Comb Round Neck T-shirt' },
  { id: '09', name: 'Polyester Honey Comb Round Neck T-shirt' },
  { id: '10', name: 'Polyester Polo T-shirt' },
  { id: '11', name: 'Dot Knit Polo 180 GSM T-shirt' },
  { id: '12', name: 'Premium Dot Knit Round Neck T-shirt' },
  { id: '13', name: 'Dot Knit Polo 220 GSM T-shirt' },
  { id: '14', name: 'Honeycomb Polo T-shirt' },
  { id: '15', name: 'Dri Fit Mars Polo T-shirt' },
  { id: '16', name: 'Polyester Polo Jersy' },
  { id: '17', name: 'Premium Polyester Polo T-shirt' },
  { id: '18', name: 'Premium Polycotton Polo T-shirt' },
  { id: '19', name: 'Prime Polycotton Polo T-shirt' },
  { id: '20', name: 'Polycotton Polo T-shirt' },
  { id: '21', name: 'Premium Polycotton Round Neck Prime T-shirt' },
  { id: '22', name: 'Polycotton Round Neck T-shirt' },
  { id: '23', name: 'Polycotton Round Neck T-shirt' },
  { id: '24', name: 'Polycotton Polo T-shirt With Tipping' },
  { id: '25', name: 'Pure Cotton Round Neck Bio Washed T-shirt' },
  { id: '26', name: 'Cotton Round Neck T-shirt' },
  { id: '27', name: 'Cotton Polo Matty Finish T-shirt' },
  { id: '28', name: 'Prime Cotton Polo T-shirt' },
  { id: '29', name: 'Premium Cotton Polo T-shirt With Tipping' },
  { id: '30', name: 'Premium Cotton Polo T-shirt With Pocket' },
  { id: '31', name: 'Cotton Full Sleeve Round Neck T-shirt' },
  { id: '32', name: '100% Cotton Oversized T-shirt' },
  { id: '33', name: 'Cotton Oversized T-shirt' },
  { id: '34', name: 'V-Neck Half Sleeve T-shirt 180 GSM' },
  { id: '35', name: "Cotton Round Neck Women's T-shirt" },
  { id: '36', name: 'Cotton V-Neck T-shirt' },
  { id: '37', name: 'C Premium Colour Cotton Round Neck Bio Washed T-shirt' },
  { id: '38', name: 'French Teery oversize R.N' },
  { id: '39', name: 'Cotton Round Neck Sweatshirt' },
  { id: '40', name: 'Track Shoot' },
  { id: '41', name: 'Polycotton Hoodies With Zipper' },
  { id: '42', name: 'unisex pullover Hoodies premium' },
  { id: '43', name: 'unisex Full Zipper Hoodies premium' },
];

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


      {/* Catalog Index Section */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">The Collection</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mt-4">
              PRODUCT <span className="text-accent italic">INDEX</span>
            </h2>
            <div className="w-20 h-1 bg-black mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CATALOG_INDEX.map((item, idx) => (
              <div 
                key={item.id} 
                data-aos="fade-up" 
                data-aos-delay={idx * 50}
                className="group relative bg-white p-6 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-black cursor-default overflow-hidden"
              >
                {/* Number Background */}
                <div className="absolute top-0 right-0 p-2 opacity-5 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-10 transition-all duration-700">
                  <span className="text-8xl font-black">{item.id}</span>
                </div>

                <div className="relative z-10">
                  <div className="text-3xl font-black text-black tracking-tighter mb-1 transition-all duration-500 group-hover:text-accent">
                    {item.id}
                  </div>
                  <div className="h-0.5 w-8 bg-gray-200 mb-4 transition-all duration-500 group-hover:w-16 group-hover:bg-accent"></div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed group-hover:text-black transition-colors duration-500">
                    {item.name}
                  </p>
                </div>

                {/* Corner Decoration */}
                <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-accent transform rotate-45"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center" data-aos="fade-up">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              * This index represents our current production range. Items may vary based on seasonal updates.
            </p>
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
