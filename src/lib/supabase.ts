import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Both are null when env vars are missing: the app then runs on src/data/content.json.

// Browser client for auth and progress. It keeps the session (and the PKCE verifier
// used by Google sign-in) in cookies, so /auth/callback can finish the login on the server.
export const supabase = url && key ? createBrowserClient(url, key) : null

// Plain anonymous client for reading public lesson content during static generation.
export const supabasePublic = url && key ? createClient(url, key) : null
