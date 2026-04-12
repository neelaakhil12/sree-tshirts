import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

// Helper to derive categories from product list
const deriveCategories = (prods) => {
  const uniqueTypes = [...new Set(prods.map(p => p.category))];
  return uniqueTypes.map(type => ({
    id: type,
    name: type,
    type: type,
    path: `/products?category=${type}`,
    image: `https://images.unsplash.com/photo-${type.toLowerCase().includes('shirt') ? '1523381210434-271e8be1f52b' : '1540200049848-d9813ea0e120'}?auto=format&fit=crop&q=80`
  }));
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(deriveCategories(initialProducts));
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <DataContext.Provider value={{ products, setProducts, categories, setCategories, isLoaded }}>
      {children}
    </DataContext.Provider>
  );
};
