import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useData } from '../../context/DataContext'

const CategorySection = () => {
  const { categories } = useData()

  return (
    <section className="py-8 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-6 flex flex-col items-center" data-aos="fade-up">
         <span className="text-accent font-black tracking-widest text-xs mb-3">SHOP BY CATEGORY</span>
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tighter text-center uppercase">
           DISCOVER YOUR <br /> PERFECT <span className="text-accent">MINGLE.</span>
         </h2>
      </div>

      <div className="flex overflow-x-auto gap-4 md:gap-8 px-4 md:px-[5%] pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar">
        {categories.map((cat, idx) => (
          <Link 
            key={cat.id} 
            to={cat.path}
            className="group relative h-[320px] md:h-[400px] min-w-[220px] sm:min-w-[280px] md:min-w-[320px] overflow-hidden bg-gray-100 block snap-start"
            data-aos="fade-right"
            data-aos-delay={idx * 100}
          >
            {/* Background image */}
            <img 
              src={cat.image} 
              alt={cat.name}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 bg-gray-100"
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=' + cat.name}
            />
            
            {/* Overlay content */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-6 md:p-8 text-white">
               <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-4 transform group-hover:-translate-y-2 transition-transform leading-snug break-words uppercase">{cat.name}</h3>
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
