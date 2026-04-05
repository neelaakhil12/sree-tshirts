import React from 'react'
import { MessageCircle } from 'lucide-react'

const WhatsAppButton = () => {
  const whatsappNumber = '9398292014'
  const message = 'Hello Wear Mingle! I am interested in your T-shirts.'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 transition-all whatsapp-pulse"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
    </a>
  )
}

export default WhatsAppButton
