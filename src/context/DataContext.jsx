import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

// The original 3 categories from the Preferred UI
const initialCategories = [
  { 
    id: 'tshirts', 
    name: 'TSHIRTS COLLECTION', 
    type: 'Tshirts', 
    path: '/products?category=Tshirts', 
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80' 
  },
  { 
    id: 'school', 
    name: 'SCHOOL UNIFORM', 
    type: 'School uniform', 
    path: '/products?category=School uniform', 
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80' 
  },
  { 
    id: 'woodies', 
    name: 'WOODIES RANGE', 
    type: 'Hoodies', 
    path: '/products?category=Hoodies', 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80'
  }
];

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Map internal categories to fit the 3 main collections
  const [products] = useState(initialProducts.map(p => {
    let internalCategory = p.category;
    // Grouping logic for T-shirts
    if (['Polyester', 'PolyCotton', 'Cotton'].includes(p.category)) {
      internalCategory = 'Tshirts';
    }
    return { 
      ...p, 
      displayCategory: internalCategory,
      originalPrice: p.originalPrice || p.price
    };
  }));

  const [categories] = useState(initialCategories);
  const [isLoaded] = useState(true);

  return (
    <DataContext.Provider value={{ products, categories, isLoaded }}>
      {children}
    </DataContext.Provider>
  );
};
