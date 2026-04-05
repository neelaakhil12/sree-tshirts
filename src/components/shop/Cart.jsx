import React from 'react'
import { X, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { Link } from 'react-router-dom'

const Cart = () => {
  const { 
    cartItems, isCartOpen, setIsCartOpen, 
    updateQuantity, removeFromCart, 
    cartTotal, cartMRP, cartDiscount 
  } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-[100] transition-all overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" 
        onClick={() => setIsCartOpen(false)}
      ></div>
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl flex flex-col p-0 transition-all animate-slide-left border-l-4 border-accent">
         {/* Bag Header */}
         <div className="p-8 pb-6 flex items-center justify-between border-b border-gray-100 shrink-0">
            <div className="flex items-center space-x-3">
               <ShoppingBag size={24} className="text-accent" />
               <h2 className="text-xl font-black uppercase tracking-widest text-black">
                  YOUR BAG ({cartItems.length})
               </h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-3 border border-gray-100 rounded-full hover:bg-gray-50 transition-all"
            >
               <X size={20} />
            </button>
         </div>

         {/* Bag Items Area */}
         <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scroll-smooth">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 animate-fade-up">
                 <div className="w-24 h-24 bg-gray-50 flex items-center justify-center rounded-full mx-auto mb-6">
                    <ShoppingBag size={32} className="text-gray-200" />
                 </div>
                 <h3 className="text-lg font-black uppercase tracking-widest mb-2">HEY, NO MINGLE HERE!</h3>
                 <p className="text-gray-400 text-sm mb-10">There is nothing in your bag. Let's add some items.</p>
                 <Link 
                   to="/products"
                   onClick={() => setIsCartOpen(false)}
                   className="inline-block border-2 border-black text-black px-10 py-4 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                 >
                   LET'S SHOP
                 </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex space-x-6 group animate-fade-up">
                   <div className="w-24 h-32 flex-shrink-0 bg-gray-50 overflow-hidden ring-1 ring-gray-100 group-hover:ring-accent transition-all duration-300">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className="flex-grow space-y-2 py-1">
                      <div className="flex justify-between items-start">
                         <h4 className="text-sm font-black text-black leading-tight max-w-[200px]">{item.name}</h4>
                         <button 
                           onClick={() => removeFromCart(item.id, item.size)}
                           className="text-gray-300 hover:text-red-500 p-1"
                         >
                            <X size={16} />
                         </button>
                      </div>
                      <div className="flex items-center space-x-3">
                         <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">Size: {item.size}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-3 pt-2">
                         <span className="text-sm font-black">₹{item.price * item.quantity}</span>
                         <span className="text-[10px] text-gray-400 line-through">₹{item.originalPrice * item.quantity}</span>
                      </div>
                      {/* Qty Controls */}
                      <div className="flex items-center space-x-4 mt-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                         <div className="flex items-center border border-gray-100 p-1 bg-gray-50">
                            <button onClick={() => updateQuantity(item.id, item.size, -1)} className="p-1 hover:text-accent disabled:opacity-30" disabled={item.quantity <= 1}>
                               <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="px-4 text-xs font-black">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, 1)} className="p-1 hover:text-accent">
                               <Plus size={14} strokeWidth={3} />
                            </button>
                         </div>
                         <button className="text-[10px] font-black underline hover:text-accent">MOVE TO WISHLIST</button>
                      </div>
                   </div>
                </div>
              ))
            )}
         </div>

         {/* Bag Footer Area */}
         {cartItems.length > 0 && (
           <div className="p-8 pt-6 border-t border-gray-100 space-y-6 shrink-0 bg-gray-50/50">
              <div className="space-y-3">
                 <h4 className="text-[10px] font-black tracking-widest text-gray-400 uppercase">PRICE DETAILS ({cartItems.length} Items)</h4>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Total MRP</span>
                    <span className="font-black">₹{cartMRP}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Discount on MRP</span>
                    <span className="text-green-500 font-black">-₹{cartDiscount}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Coupon Discount</span>
                    <button className="text-accent font-black underline">APPLY COUPON</button>
                 </div>
                 <div className="pt-3 border-t border-gray-200 flex justify-between font-black text-lg">
                    <span>Total Amount</span>
                    <span className="text-accent">₹{cartTotal}</span>
                 </div>
              </div>
              
              <button 
                className="w-full bg-accent text-white h-16 rounded-none font-black text-xs tracking-widest flex items-center justify-center space-x-3 hover:bg-opacity-90 transition-all shadow-xl shadow-accent/20"
                onClick={() => alert('Redirecting to checkout... Secure Checkout process for Srikanth.')}
              >
                 <span>PLACE ORDER</span>
                 <ArrowRight size={18} />
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-[10px] font-black uppercase text-gray-400">
                 <ShieldCheck size={14} />
                 <span>100% SECURE TRANSACTIONS • VERIFIED BY WEAR MINGLE</span>
              </div>
           </div>
         )}
      </div>
    </div>
  )
}

export default Cart
