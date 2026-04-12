import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parsing because dotenv is not installed
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1');
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCatalog() {
  console.log('--- FETCHING PRODUCTS ---');
  const { data: products, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products.`);

  // 1. UPDATE CATEGORIES BY ID RANGE
  console.log('\n--- UPDATING CATEGORIES ---');
  for (const product of products) {
    const id = parseInt(product.id);
    let newCategory = null;

    if (id >= 1 && id <= 36) newCategory = 'Tshirts'; 
    else if (id >= 37 && id <= 40) newCategory = 'Hoodies';
    else if (id >= 41 && id <= 44) newCategory = 'School uniform';

    if (newCategory && product.category !== newCategory) {
      console.log(`Updating Product #${id} ("${product.name}") -> ${newCategory}`);
      const { error: updateError } = await supabase
        .from('products')
        .update({ category: newCategory })
        .eq('id', id);
      
      if (updateError) console.error(`Error updating #${id}:`, updateError.message);
    }
  }

  // 2. REMOVE DUPLICATES (by name)
  console.log('\n--- CHECKING FOR DUPLICATES ---');
  const nameMap = {};
  const toDelete = [];

  // Re-fetch to get updated state
  const { data: currentProducts } = await supabase.from('products').select('id, name').order('id', { ascending: true });

  currentProducts.forEach(p => {
    const name = p.name.trim().toLowerCase();
    if (nameMap[name]) {
      // Duplicate found. Keep the one with lowest ID (already first due to order)
      toDelete.push(p.id);
    } else {
      nameMap[name] = p.id;
    }
  });

  if (toDelete.length > 0) {
    console.log(`Found ${toDelete.length} duplicates to remove: IDs [${toDelete.join(', ')}]`);
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', toDelete);
    
    if (deleteError) console.error('Error deleting duplicates:', deleteError.message);
    else console.log('Successfully removed duplicates.');
  } else {
    console.log('No duplicates found.');
  }

  console.log('\n--- DONE ---');
}

updateCatalog();
