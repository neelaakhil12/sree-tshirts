import React from 'react'

const Hero = () => {
  return (
    <section className="relative h-[200px] md:h-screen min-h-[200px] md:min-h-[600px] w-full flex items-center justify-center overflow-hidden mt-[80px] md:mt-0">
      {/* Full Hero Image Background */}
      <img 
        src="/hero-main.png" 
        alt="Sree Tshirts Collection"
        className="absolute inset-0 w-full h-full object-cover object-top" 
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Typewritten Tagline */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <h1 className="text-white text-xs sm:text-2xl md:text-6xl font-black uppercase tracking-tighter mb-6 relative">
          <span className="typewriter">MINGLE WITH STYLE.</span>
        </h1>
        
        {/* Secondary Slogan */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 px-6 py-3 rounded shadow-2xl">
           <h2 className="text-accent text-[12px] sm:text-base md:text-xl font-bold tracking-[0.2em]">
             <span className="typewriter">Bulk Orders & Better Prices</span>
           </h2>
        </div>
      </div>
    </section>
  )
}

export default Hero
