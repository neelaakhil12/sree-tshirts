import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { products as initialProducts } from '../data/products';

// Helper to derive categories from product list
const deriveCategories = (prods) => {
  const uniqueTypes = [...new Set(prods.map(p => p.category))];
  return uniqueTypes.map(type => ({
    name: type,
    type: type,
    path: `/products?category=${type}`,
    // Higher quality placeholders based on category name
    image: `https://images.unsplash.com/photo-${type.toLowerCase().includes('shirt') ? '1523381210434-271e8be1f52b' : '1540200049848-d9813ea0e120'}?auto=format&fit=crop&q=80`
  }));
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [products, setProductsState] = useState([]);
  const [categories, setCategoriesState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCloudSync, setIsCloudSync] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: catData, error: catError } = await supabase.from('categories').select('*');
      const { data: prodData, error: prodError } = await supabase.from('products').select('*');

      if (catError) throw catError;
      if (prodError) throw prodError;

      // Use cloud data if BOTH tables have some data
      if (catData && catData.length > 0 && prodData && prodData.length > 0) {
        setCategoriesState(catData);
        setProductsState(prodData.map(p => ({
          ...p,
          originalPrice: p.original_price || p.price // Compatibility mapping
        })));
        setIsCloudSync(true);
      } else {
        // FALLBACK: Use full local products and derived categories
        console.log('Using local fallback data with derived categories.');
        setProductsState(initialProducts);
        setCategoriesState(deriveCategories(initialProducts));
        setIsCloudSync(false);
      }
      
    } catch (err) {
      console.error('Fetch error:', err.message);
      setProductsState(initialProducts);
      setCategoriesState(deriveCategories(initialProducts));
      setIsCloudSync(false);
    } finally {
      setIsLoaded(true);
    }
  };

  const seedDatabase = async () => {
    try {
      setIsLoaded(false);
      
      const catsToSeed = deriveCategories(initialProducts).map(({delay, ...rest}) => rest);
      const prodsToSeed = initialProducts.map(({id, originalPrice, ...rest}) => ({
        ...rest,
        original_price: originalPrice || rest.price,
        sizes: rest.sizes || [],
        colors: rest.colors || []
      }));

      // Clear tables first for a clean seed
      await supabase.from('categories').delete().neq('id', -1);
      await supabase.from('products').delete().neq('id', -1);

      const { error: cErr } = await supabase.from('categories').insert(catsToSeed);
      if (cErr) throw cErr;

      const { error: pErr } = await supabase.from('products').insert(prodsToSeed);
      if (pErr) throw pErr;

      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Seed error:', err);
      return { success: false, error: err.message };
    }
  };

  const setProducts = (newOrFn) => {
    setProductsState(prev => typeof newOrFn === 'function' ? newOrFn(prev) : newOrFn);
  };

  const setCategories = (newOrFn) => {
    setCategoriesState(prev => typeof newOrFn === 'function' ? newOrFn(prev) : newOrFn);
  };

  return (
    <DataContext.Provider value={{ products, setProducts, categories, setCategories, isLoaded, isCloudSync, fetchData, seedDatabase }}>
      {isLoaded && children}
    </DataContext.Provider>
  );
};
