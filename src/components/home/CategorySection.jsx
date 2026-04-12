import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: "TSHIRTS COLLECTION",
    image: "/images/products/pure-cotton-bio-washed/black.png",
    path: "/products?category=Tshirts",
    count: 140,
    delay: 0,
  },
  {
    id: 2,
    name: "SCHOOL UNIFORM",
    image: "/images/products/school-uniform/shirt-boys.png",
    path: "/products?category=School uniform",
    count: 45,
    delay: 100,
  },
  {
    id: 3,
    name: "HOODIES RANGE",
    image: "/images/products/unisex-pullover-hoodies/red.png",
    path: "/products?category=Hoodies",
    count: 28,
    delay: 200,
  },
  {
    id: 4,
    name: "CAPS",
    image: "/images/products/categories/caps.png",
    path: "/products?category=Caps",
    count: 12,
    delay: 300,
  },

  {
    id: 6,
    name: "TOTE BAGS",
    image: "/images/products/categories/tote-bags.png",
    path: "/products?category=Tote Bags",
    count: 15,
    delay: 500,
  },
  {
    id: 7,
    name: "DIARY",
    image: "/images/products/categories/diary.png",
    path: "/products?category=Diary",
    count: 8,
    delay: 600,
  },
  {
    id: 8,
    name: "PENS",
    image: "/images/products/categories/pens.png",
    path: "/products?category=Pens",
    count: 25,
    delay: 700,
  },
  {
    id: 9,
    name: "BOTTLE",
    image: "/images/products/categories/bottle.png",
    path: "/products?category=Bottle",
    count: 20,
    delay: 800,
  },
  {
    id: 10,
    name: "COLLEGE/SCHOOL BAG",
    image: "/images/products/categories/school-bag.png",
    path: "/products?category=College/School Bag",
    count: 10,
    delay: 900,
  },
  {
    id: 11,
    name: "LAPTOP BAGS",
    image: "/images/products/categories/laptop-bag.png",
    path: "/products?category=Laptop Bags",
    count: 14,
    delay: 1000,
  },
  {
    id: 12,
    name: "CORPORATE GIFTINGS",
    image: "/images/products/categories/corporate-gift.png",
    path: "/products?category=Corporate Giftings",
    count: 30,
    delay: 1100,
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
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 bg-gray-100"
            />
            
            {/* Overlay content */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-6 md:p-8 text-white">
               <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-4 transform group-hover:-translate-y-2 transition-transform leading-snug break-words">{cat.name}</h3>
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
