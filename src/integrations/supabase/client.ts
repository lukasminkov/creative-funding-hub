// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://caeupilwfemsubjqnipb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZXVwaWx3ZmVtc3VianFuaXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDcyNzUsImV4cCI6MjA1OTM4MzI3NX0.VvCM4Y1jTiwe11YA1LHPg9iJtU8wFSaJK0oUAycrf64";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);