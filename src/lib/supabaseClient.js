import { createClient } from '@supabase/supabase-js'

// 用你自己的项目地址和 anon key 替换下面两行：
const supabaseUrl = 'https://qpqeheoxllbqjqjiuszo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwcWVoZW94bGxicWpxaml1c3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODMwNzgsImV4cCI6MjA2MTE1OTA3OH0.NNOn_mIyL2ANankXfsESyFZgG0SWT7ws2ZsFkxP5LEk'

export const supabase = createClient(supabaseUrl, supabaseKey)
