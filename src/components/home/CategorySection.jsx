import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: "TSHIRTS COLLECTION",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=Tshirts",
    count: 140,
    delay: 0,
  },
  {
    id: 2,
    name: "SCHOOL UNIFORM",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=School uniform",
    count: 45,
    delay: 100,
  },
  {
    id: 3,
    name: "WOODIES RANGE",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=Woodies",
    count: 28,
    delay: 200,
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-12 flex flex-col items-center" data-aos="fade-up">
         <span className="text-accent font-black tracking-widest text-xs mb-3">SHOP BY CATEGORY</span>
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tighter text-center uppercase">
           DISCOVER YOUR <br /> PERFECT <span className="text-accent">MINGLE.</span>
         </h2>
      </div>

      <div className="flex overflow-x-auto gap-4 md:gap-8 px-4 md:px-[5%] pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            to={cat.path}
            className="group relative h-[320px] md:h-[400px] min-w-[220px] sm:min-w-[280px] md:min-w-[320px] overflow-hidden bg-gray-100 block snap-start"
            data-aos="fade-right"
            data-aos-delay={cat.delay}
          >
            {/* Background image */}
            <img 
              src={cat.image} 
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay content */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-6 md:p-8 text-white">
               <span className="text-[10px] sm:text-xs font-bold tracking-widest mb-2 transform group-hover:-translate-y-2 transition-transform uppercase">{cat.count} DESIGNS AVAILABLE</span>
               <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4 transform group-hover:-translate-y-2 transition-transform leading-none whitespace-nowrap">{cat.name}</h3>
               <div className="flex items-center space-x-2 transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="font-extrabold text-xs sm:text-sm tracking-widest border-b border-white pb-1">EXPLORE COLLECTION</span>
                  <ArrowRight size={16} />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategorySection
