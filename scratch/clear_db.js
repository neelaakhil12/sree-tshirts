import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearProducts() {
  console.log('Clearing products from Supabase...')
  const { error } = await supabase
    .from('products')
    .delete()
    .neq('id', 0) // Delete all where ID is not 0 (effectively all)

  if (error) {
    console.error('Error clearing products:', error.message)
  } else {
    console.log('Successfully cleared all products from Supabase.')
  }
}

clearProducts()
