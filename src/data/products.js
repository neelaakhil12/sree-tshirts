export const products = [
  {
    id: 1,
    name: "Classic White Polo T-Shirt",
    price: 599,
    originalPrice: 1299,
    discount: "54% OFF",
    rating: 4.5,
    reviews: 120,
    category: "Men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Premium cotton polo t-shirt with a classic fit. Perfect for casual outings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Navy", "Black"],
  },
  {
    id: 2,
    name: "Oversized Graphic Tee",
    price: 799,
    originalPrice: 1599,
    discount: "50% OFF",
    rating: 4.8,
    reviews: 85,
    category: "Women",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    description: "Stylish oversized graphic t-shirt for a modern street-style look.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Beige", "Lavender", "White"],
  },
  {
    id: 3,
    name: "Striped Crew Neck",
    price: 499,
    originalPrice: 999,
    discount: "50% OFF",
    rating: 4.2,
    reviews: 210,
    category: "Men",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
    description: "Breathable cotton striped t-shirt for everyday comfort.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Blue/White", "Red/Black"],
  },
  {
    id: 4,
    name: "Kids Sporty Jersey",
    price: 399,
    originalPrice: 799,
    discount: "50% OFF",
    rating: 4.6,
    reviews: 45,
    category: "Kids",
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e9?auto=format&fit=crop&q=80&w=800",
    description: "Dry-fit jersey for active kids. Durable and easy to wash.",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: ["Red", "Blue", "Green"],
  },
  {
    id: 5,
    name: "V-Neck Essential Tee",
    price: 349,
    originalPrice: 699,
    discount: "50% OFF",
    rating: 4.4,
    reviews: 320,
    category: "Women",
    image: "https://images.unsplash.com/photo-1554568212-3c1630c95a4c?auto=format&fit=crop&q=80&w=800",
    description: "Basic V-neck t-shirt made with soft premium cotton.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "White", "Grey"],
  },
  {
    id: 6,
    name: "Vintage Rock Tee",
    price: 899,
    originalPrice: 1799,
    discount: "50% OFF",
    rating: 4.9,
    reviews: 67,
    category: "Men",
    image: "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?auto=format&fit=crop&q=80&w=800",
    description: "Acid-washed vintage t-shirt with classic rock artwork.",
    sizes: ["M", "L", "XL"],
    colors: ["Charcoal", "Olive"],
  }
];

// Dynamically generate more for filler (up to 42)
const categories = ["Men", "Women", "Kids"];
const styles = ["Graphic", "Solid", "Polo", "Oversized", "V-Neck", "Crew Neck", "Athletic"];
const adjectives = ["Premium", "Essential", "Modern", "Vintage", "Classic", "Urban", "Simple"];

for (let i = 7; i <= 42; i++) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const style = styles[Math.floor(Math.random() * styles.length)];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const price = 299 + Math.floor(Math.random() * 10) * 100 + 99;
  
  products.push({
    id: i,
    name: `${adj} ${cat} ${style} T-Shirt`,
    price: price,
    originalPrice: price * 2,
    discount: "50% OFF",
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    reviews: Math.floor(Math.random() * 500),
    category: cat,
    image: cat === "Men" 
      ? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=60&w=600"
      : cat === "Women"
      ? "https://images.unsplash.com/photo-1554568212-3c1630c95a4c?auto=format&fit=crop&q=60&w=600"
      : "https://images.unsplash.com/photo-1519457431-757104681f0b?auto=format&fit=crop&q=60&w=600",
    description: `A ${style.toLowerCase()} t-shirt designed for ${cat.toLowerCase()}. High quality fabric ensuring long lasting comfort.`,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray", "Blue"],
  });
}
