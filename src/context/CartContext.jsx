import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wear_mingle_cart')
    if (saved) setCartItems(JSON.parse(saved))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('wear_mingle_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, size, color) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size)
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      }
      return [...prev, { ...product, size, color, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id, size, delta) => {
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.size === size) 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ))
  }

  const clearCart = () => setCartItems([])

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartMRP = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0)
  const cartDiscount = cartMRP - cartTotal

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, 
      isCartOpen, setIsCartOpen, cartTotal, cartMRP, cartDiscount, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
