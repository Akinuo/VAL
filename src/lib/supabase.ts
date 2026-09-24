import {createClient} from '@supabase/supabase-js'
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// null when env vars are missing: the app then runs on the bundled content in src/data/content.json.
export const supabase=url&&key?createClient(url,key):null
