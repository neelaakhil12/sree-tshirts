import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://afhqroprlyydizwlqzih.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaHFyb3BybHl5ZGl6d2xxemloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5Nzk1ODksImV4cCI6MjA5MTU1NTU4OX0.k09x-6Rd2MRl_F_epkhEjQDhtoZtU7R3ep-SK1HLCl0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearProducts() {
  console.log('Clearing products from Supabase...')
  const { error } = await supabase
    .from('products')
    .delete()
    .neq('id', 0)

  if (error) {
    console.error('Error clearing products:', error.message)
  } else {
    console.log('Successfully cleared all products from Supabase.')
  }
}

clearProducts()
