import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

// Define our initial categories here for fallback
const initialCategories = [
  { id: 1, name: "TSHIRTS COLLECTION", image: "/images/products/pure-cotton-bio-washed/black.png", path: "/products?category=Tshirts", count: 140, type: "Tshirts" },
  { id: 2, name: "SCHOOL UNIFORM", image: "/images/products/school-uniform/shirt-boys.png", path: "/products?category=School uniform", count: 45, type: "School uniform" },
  { id: 3, name: "HOODIES RANGE", image: "/images/products/unisex-pullover-hoodies/red.png", path: "/products?category=Hoodies", count: 28, type: "Hoodies" },
  { id: 4, name: "CAPS", image: "/images/products/categories/caps.png", path: "/products?category=Caps", count: 12, type: "Caps" },
  { id: 5, name: "TOTE BAGS", image: "/images/products/categories/tote-bags.png", path: "/products?category=Tote Bags", count: 15, type: "Tote Bags" },
  { id: 6, name: "DIARY", image: "/images/products/categories/diary.png", path: "/products?category=Diary", count: 8, type: "Diary" },
  { id: 7, name: "PENS", image: "/images/products/categories/pens.png", path: "/products?category=Pens", count: 25, type: "Pens" },
  { id: 8, name: "BOTTLE", image: "/images/products/categories/bottle.png", path: "/products?category=Bottle", count: 20, type: "Bottle" },
  { id: 9, name: "COLLEGE/SCHOOL BAG", image: "/images/products/categories/school-bag.png", path: "/products?category=College/School Bag", count: 10, type: "College/School Bag" },
  { id: 10, name: "LAPTOP BAGS", image: "/images/products/categories/laptop-bag.png", path: "/products?category=Laptop Bags", count: 14, type: "Laptop Bags" },
  { id: 11, name: "CORPORATE GIFTINGS", image: "/images/products/categories/corporate-gift.png", path: "/products?category=Corporate Giftings", count: 30, type: "Corporate Giftings" }
];

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [products, setProductsState] = useState([]);
  const [categories, setCategoriesState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const storedProducts = localStorage.getItem('mingle_products');
    const storedCategories = localStorage.getItem('mingle_categories');

    if (storedProducts) {
      setProductsState(JSON.parse(storedProducts));
    } else {
      setProductsState(initialProducts);
      localStorage.setItem('mingle_products', JSON.stringify(initialProducts));
    }

    if (storedCategories) {
      setCategoriesState(JSON.parse(storedCategories));
    } else {
      setCategoriesState(initialCategories);
      localStorage.setItem('mingle_categories', JSON.stringify(initialCategories));
    }
    
    setIsLoaded(true);
  }, []);

  const setProducts = (newOrFn) => {
    setProductsState(prev => {
      const updated = typeof newOrFn === 'function' ? newOrFn(prev) : newOrFn;
      localStorage.setItem('mingle_products', JSON.stringify(updated));
      return updated;
    });
  };

  const setCategories = (newOrFn) => {
    setCategoriesState(prev => {
      const updated = typeof newOrFn === 'function' ? newOrFn(prev) : newOrFn;
      localStorage.setItem('mingle_categories', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <DataContext.Provider value={{ products, setProducts, categories, setCategories, isLoaded }}>
      {isLoaded && children}
    </DataContext.Provider>
  );
};
