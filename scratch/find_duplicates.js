import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables are not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findDuplicates() {
  const { data, error } = await supabase.from('products').select('id, name');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  const nameMap = {};
  const duplicates = [];

  data.forEach(p => {
    const name = p.name.trim().toLowerCase();
    if (nameMap[name]) {
      nameMap[name].push(p.id);
    } else {
      nameMap[name] = [p.id];
    }
  });

  for (const name in nameMap) {
    if (nameMap[name].length > 1) {
      duplicates.push({ name, ids: nameMap[name] });
    }
  }

  if (duplicates.length === 0) {
    console.log('No duplicate products found.');
  } else {
    console.log('Duplicate products found:');
    duplicates.forEach(d => {
      console.log(`- "${d.name}": IDs [${d.ids.join(', ')}]`);
    });
    console.log('\nTo delete duplicates, keep the first ID and delete the rest.');
  }
}

findDuplicates();
