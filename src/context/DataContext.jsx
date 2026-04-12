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

  // Helper: map a raw DB product to app format
  const mapDbProduct = (p) => {
    let internalCategory = p.category;
    if (['Polyester', 'PolyCotton', 'Cotton'].includes(p.category)) {
      internalCategory = 'Tshirts';
    }
    return {
      ...p,
      originalPrice: p.original_price || p.price,
      discount: p.discount || '',
      colorImages: p.color_images || {},
      features: p.features || [],
      measurementChart: p.measurement_chart || [],
      displayCategory: internalCategory,
    };
  };

  // Prioritized sorting for categories
  const sortCategories = (cats) => {
    const order = ['tshirt', 'hoodie', 'uniform'];
    return [...cats].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      const getRank = (name) => {
        if (name.includes('tshirt') || name.includes('t-shirt')) return 1;
        if (name.includes('hoodie') || name.includes('woodie')) return 2;
        if (name.includes('uniform') || name.includes('school')) return 3;
        return 99;
      };

      const rankA = getRank(nameA);
      const rankB = getRank(nameB);

      if (rankA !== rankB) return rankA - rankB;
      return nameA.localeCompare(nameB);
    });
  };

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
      setCategories(sortCategories(initialCategories));
      setIsLoaded(true);

      // 2. Effort to sync from Supabase
      try {
        const { data: dbProducts, error: pError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (!pError && dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts.map(mapDbProduct));
        }

        const { data: dbCategories, error: cError } = await supabase
          .from('categories')
          .select('*');

        if (!cError && dbCategories && dbCategories.length > 0) {
          setCategories(sortCategories(dbCategories));
        }
      } catch (err) {
        console.warn('Supabase sync skipped - using local data fallback:', err.message);
      }
    };

    loadData();

    // 3. Supabase Realtime — instant cross-tab updates
    const channel = supabase
      .channel('products-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProducts(prev =>
              prev.map(p => p.id === payload.new.id ? mapDbProduct(payload.new) : p)
            );
          } else if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, mapDbProduct(payload.new)]);
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DataContext.Provider value={{ products, setProducts, categories, setCategories, isLoaded }}>
      {children}
    </DataContext.Provider>
  );
};
