import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: "MEN'S COLLECTION",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=Men",
    count: 18,
    delay: 0,
  },
  {
    id: 2,
    name: "WOMEN'S STYLE",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=Women",
    count: 15,
    delay: 100,
  },
  {
    id: 3,
    name: "KIDS SPECIAL",
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e9?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=Kids",
    count: 9,
    delay: 200,
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 md:py-24 bg-white px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16" data-aos="fade-up">
           <span className="text-accent font-black tracking-widest text-xs mb-3">SHOP BY CATEGORY</span>
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tighter text-center uppercase">
             DISCOVER YOUR <br /> PERFECT <span className="text-accent">MINGLE.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.path}
              className="group relative h-[500px] overflow-hidden bg-gray-100 block"
              data-aos="fade-up"
              data-aos-delay={cat.delay}
            >
              {/* Background image */}
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              
              {/* Overlay content */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-8 text-white">
                 <span className="text-[10px] sm:text-xs font-bold tracking-widest mb-2 transform group-hover:-translate-y-2 transition-transform uppercase">{cat.count} DESIGNS AVAILABLE</span>
                 <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-4 transform group-hover:-translate-y-2 transition-transform">{cat.name}</h3>
                 <div className="flex items-center space-x-2 transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="font-extrabold text-sm tracking-widest border-b border-white pb-1">EXPLORE COLLECTION</span>
                    <ArrowRight size={16} />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
