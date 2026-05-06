import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://afhqroprlyydizwlqzih.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaHFyb3BybHl5ZGl6d2xxemloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5Nzk1ODksImV4cCI6MjA5MTU1NTU4OX0.k09x-6Rd2MRl_F_epkhEjQDhtoZtU7R3ep-SK1HLCl0'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProductOne() {
    const { data, error } = await supabase.from('products').select('*').eq('id', 1)
    if (error) {
        console.error(error)
        return
    }
    console.log('Product 1:', JSON.stringify(data, null, 2))
}

checkProductOne()
