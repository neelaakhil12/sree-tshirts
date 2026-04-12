import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { supabase } from '../lib/supabase';

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hybrid Loading Logic
  useEffect(() => {
    const loadData = async () => {
      // 1. Start with local fallback data
      const processedLocal = initialProducts.map(p => {
        let internalCategory = p.category;
        if (['Polyester', 'PolyCotton', 'Cotton'].includes(p.category)) {
          internalCategory = 'Tshirts';
        }
        return { 
          ...p, 
          displayCategory: internalCategory,
          originalPrice: p.originalPrice || p.price
        };
      });
      setProducts(processedLocal);
      setIsLoaded(true);

      // 2. Effort to sync from Supabase
      try {
        const { data: dbProducts, error: pError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (!pError && dbProducts && dbProducts.length > 0) {
          const processedDb = dbProducts.map(p => {
             let internalCategory = p.category;
             if (['Polyester', 'PolyCotton', 'Cotton'].includes(p.category)) {
               internalCategory = 'Tshirts';
             }
             return {
                ...p,
                originalPrice: p.original_price || p.price,
                discount: p.discount || '',
                colorImages: p.color_images || {},
                displayCategory: internalCategory
             };
          });
          setProducts(processedDb);
        }

        const { data: dbCategories, error: cError } = await supabase
          .from('categories')
          .select('*')
          .order('id', { ascending: true });

        if (!cError && dbCategories && dbCategories.length > 0) {
           setCategories(dbCategories);
        }
      } catch (err) {
        console.warn('Supabase sync skipped - using local data fallback:', err.message);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ products, setProducts, categories, isLoaded }}>
      {children}
    </DataContext.Provider>
  );
};
