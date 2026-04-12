import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { products as initialProducts } from '../data/products';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [products, setProductsState] = useState([]);
  const [categories, setCategoriesState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

      // Handle empty tables by seeding or returning empty
      setCategoriesState(catData || []);
      setProductsState(prodData || []);
      
    } catch (err) {
      console.error('Error fetching data from Supabase:', err.message);
      // Fallback to empty states if DB is not ready yet
      setCategoriesState([]);
      setProductsState([]);
    } finally {
      setIsLoaded(true);
    }
  };

  // Sync / Seed helper (Used by Admin to initialize DB)
  const seedDatabase = async (categoriesToSeed, productsToSeed) => {
    try {
      // 1. Clear existing local state for clean start
      setIsLoaded(false);

      // 2. Insert categories
      const formattedCats = categoriesToSeed.map(({id, delay, ...rest}) => rest);
      await supabase.from('categories').insert(formattedCats);

      // 3. Insert products
      const formattedProds = productsToSeed.map(({id, ...rest}) => ({
        ...rest,
        sizes: rest.sizes || [],
        colors: rest.colors || []
      }));
      await supabase.from('products').insert(formattedProds);

      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Seed error:', err);
      return { success: false, error: err.message };
    }
  };

  const setProducts = async (newOrFn) => {
    // Note: Complex setters (functions) are harder with real DB. 
    // We expect the Admin panels to call these after successful Supabase mutations.
    if (typeof newOrFn === 'function') {
      const updated = newOrFn(products);
      setProductsState(updated);
    } else {
      setProductsState(newOrFn);
    }
  };

  const setCategories = async (newOrFn) => {
    if (typeof newOrFn === 'function') {
      const updated = newOrFn(categories);
      setCategoriesState(updated);
    } else {
      setCategoriesState(newOrFn);
    }
  };

  return (
    <DataContext.Provider value={{ products, setProducts, categories, setCategories, isLoaded, fetchData, seedDatabase }}>
      {isLoaded && children}
    </DataContext.Provider>
  );
};
