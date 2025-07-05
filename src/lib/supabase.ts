import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  address?: string;
  emergency_contact?: string;
  dietary_restrictions?: string;
  special_needs?: string;
  created_at: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  tasks: string[];
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  capacity: number;
  registered_count: number;
  created_at: string;
} 