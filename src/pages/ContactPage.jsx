import React from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight } from 'lucide-react'
import SEO from '../components/common/SEO'

const ContactPage = () => {
  const contactInfo = [
    { icon: Phone, title: 'Call Us', value: '+91 9398292014', sub: 'Mon-Sun, 9am - 9pm' },
    { icon: Mail, title: 'Email Us', value: 'sreesaiapparels7@gmail.com', sub: 'Standard response within 24h' },
    { icon: MapPin, title: 'Visit Us', value: 'Wear Mingle', sub: 'SBI Colony, Nandyal – 518501' },
    { icon: MessageSquare, title: 'WhatsApp', value: '+91 9398292014', sub: 'Instant support' },
  ];

  return (
    <div className="pt-24 bg-white">
      <SEO 
        title="Contact Us"
        description="Get in touch with Wear Mingle. Reach out for bulk orders, inquiries, or support. Visit us in Nandyal or message us on WhatsApp."
        url="/contact"
      />
      <section className="py-8 md:py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4" data-aos="fade-up">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase text-center">GET IN <span className="text-accent">TOUCH.</span></h1>
           <p className="text-center text-gray-500 font-bold uppercase tracking-widest text-sm max-w-xl mx-auto">
             Need help with an order? Want to know more about our latest collection? We're here for you.
           </p>
        </div>
      </section>

      <section className="py-12 md:py-24 px-4 overflow-hidden">
        <div className="container mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 items-start">
              
              {/* Info Column */}
              <div className="lg:col-span-5 space-y-12">
                 <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight mb-10">CONTACT INFORMATION</h2>
                 <div className="space-y-10">
                    {contactInfo.map((info, i) => (
                      <div key={i} className="flex space-x-4 sm:space-x-6 items-start group" data-aos="fade-right" data-aos-delay={i*100}>
                         <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-gray-100 flex items-center justify-center rounded-none group-hover:bg-accent group-hover:text-white transition-all transform group-hover:scale-110 flex-shrink-0">
                            <info.icon size={20} className="sm:w-6 sm:h-6" />
                         </div>
                         <div className="min-w-0 flex-1">
                            <h4 className="text-[10px] sm:text-xs font-black text-gray-400 tracking-widest uppercase mb-1">{info.title}</h4>
                            <p className="text-base sm:text-xl font-black text-black group-hover:text-accent transition-colors break-words leading-tight">{info.value}</p>
                            <p className="text-[10px] sm:text-sm text-gray-400 font-bold mt-1 uppercase tracking-tight">{info.sub}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Form Column */}
              <div className="lg:col-span-7 bg-white p-8 md:p-14 shadow-premium border border-gray-50" data-aos="fade-left">
                 <h3 className="text-2xl font-black uppercase tracking-tight mb-8">SEND US A MESSAGE</h3>
                 <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black tracking-widest text-gray-500">FULL NAME</label>
                          <input type="text" className="w-full bg-gray-50 border-none p-4 text-sm font-bold placeholder-gray-400 focus:ring-2 focus:ring-accent transition-all" placeholder="Enter your name" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black tracking-widest text-gray-500">EMAIL ADDRESS</label>
                          <input type="email" className="w-full bg-gray-50 border-none p-4 text-sm font-bold placeholder-gray-400 focus:ring-2 focus:ring-accent transition-all" placeholder="Enter your email" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black tracking-widest text-gray-500">SUBJECT</label>
                       <input type="text" className="w-full bg-gray-50 border-none p-4 text-sm font-bold placeholder-gray-400 focus:ring-2 focus:ring-accent transition-all" placeholder="Order inquiry, Bulk order, etc." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black tracking-widest text-gray-500">MESSAGE</label>
                       <textarea rows="5" className="w-full bg-gray-50 border-none p-4 text-sm font-bold placeholder-gray-400 focus:ring-2 focus:ring-accent transition-all resize-none" placeholder="Tell us how we can help..."></textarea>
                    </div>
                    <button className="bg-black text-white px-10 py-5 font-black uppercase tracking-widest flex items-center justify-center space-x-3 w-full md:w-auto hover:bg-accent transition-all shadow-xl">
                       <span>SEND MESSAGE</span>
                       <ArrowRight size={18} />
                    </button>
                 </form>
              </div>

           </div>
        </div>
      </section>

      {/* Map Section - Simplified for now */}
      <section className="py-16 md:py-24 px-4 bg-gray-900 text-white text-center">
         <div className="container mx-auto space-y-8" data-aos="fade-up">
            <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">Visit our offline outlet</h3>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
               29/207-F1-8-4, SBI Colony, Revenue Ward -29 <br />
               Nandyal – 518501, Andhra Pradesh
            </p>
            <div className="h-2 w-20 bg-accent mx-auto"></div>
         </div>
      </section>
    </div>
  )
}

export default ContactPage
