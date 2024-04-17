

const { createClient } = require('@supabase/supabase-js')
// supabase pw: w9Kxb2FevOtDMDTF
const supabaseUrl = 'https://jwmvagoeyganjbwtpftl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bXZhZ29leWdhbmpid3RwZnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczNDQyMzAsImV4cCI6MjAyMjkyMDIzMH0.VlMvBuKLcuozYyo7_VwNPZgGlFoY7sHUvgMzX0kYStQ'
//const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase }