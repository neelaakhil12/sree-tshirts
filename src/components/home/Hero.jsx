import React from 'react'

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Full Hero Image Background */}
      <img 
        src="/Gemini_Generated_Image_kebe4rkebe4rkebe.png" 
        alt="Sree Tshirts Collection"
        className="absolute inset-0 w-full h-full object-cover" 
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Typewritten Tagline */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-3xl md:text-6xl font-black uppercase tracking-tighter">
          <span className="typewriter">MINGLE WITH STYLE.</span>
        </h1>
      </div>
    </section>
  )
}

export default Hero
