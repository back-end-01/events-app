import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Optimized client-side Supabase client (for browser usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'janmashtami-app',
    },
  },
});

// Optimized server-side Supabase client (for API routes with service role)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'janmashtami-app-server',
    },
  },
});

// In-memory cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache helper functions
const cacheHelpers = {
  get(key: string) {
    const item = cache.get(key);
    if (item && Date.now() - item.timestamp < item.ttl) {
      return item.data;
    }
    if (item) {
      cache.delete(key);
    }
    return null;
  },

  set(key: string, data: any, ttl: number = 30000) { // 30 seconds default
    cache.set(key, { data, timestamp: Date.now(), ttl });
  },

  delete(key: string) {
    cache.delete(key);
  },

  clear() {
    cache.clear();
  }
};

// Database types based on current schema
export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: string;
  address?: string;
  emergency_contact?: string;
  dietary_restrictions?: string;
  special_needs?: string;
  registration_time?: string;
  status?: 'registered' | 'scanned' | 'checked-in';
  qr_code?: string;
  created_at: string;
  updated_at?: string;
}

export interface Volunteer {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  tasks?: string[];
  assigned_duty?: {
    id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    priority: string;
    route: string;
    icon: string;
    shift: string;
  };
  status?: 'active' | 'inactive';
  join_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface ScanLog {
  id: string;
  participant_id: string;
  volunteer_id?: string;
  scan_time: string;
  status: 'success' | 'error' | 'duplicate';
  message?: string;
  created_at: string;
}

export interface VolunteerApplication {
  id: string;
  user_id: string;
  name: string;
  email: string;
  duty_id: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description?: string;
  capacity: number;
  registered_count: number;
  created_at: string;
}

// Database table names
export const TABLES = {
  PARTICIPANTS: 'participants',
  VOLUNTEERS: 'volunteers',
  SCAN_LOGS: 'scan_logs',
  VOLUNTEER_APPLICATIONS: 'volunteer_applications',
  EVENTS: 'events'
} as const;

// Optimized helper functions with caching and better error handling
export const supabaseHelpers = {
  // Participant operations
  async getParticipants(useCache: boolean = true) {
    const cacheKey = 'participants_all';
    
    if (useCache) {
      const cached = cacheHelpers.get(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    const { data, error } = await supabaseAdmin
      .from(TABLES.PARTICIPANTS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      cacheHelpers.set(cacheKey, data, 30000); // 30 seconds cache
    }
    
    return { data, error };
  },

  async getParticipantByQR(qrCode: string, useCache: boolean = true) {
    const cacheKey = `participant_qr_${qrCode}`;
    
    if (useCache) {
      const cached = cacheHelpers.get(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    const { data, error } = await supabaseAdmin
      .from(TABLES.PARTICIPANTS)
      .select('*')
      .eq('qr_code', qrCode)
      .single();
    
    if (!error && data) {
      cacheHelpers.set(cacheKey, data, 60000); // 1 minute cache for QR lookups
    }
    
    return { data, error };
  },

  async createParticipant(participant: Omit<Participant, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.PARTICIPANTS)
      .insert([participant])
      .select()
      .single();
    
    if (!error) {
      // Invalidate cache
      cacheHelpers.delete('participants_all');
    }
    
    return { data, error };
  },

  async updateParticipantStatus(id: string, status: Participant['status']) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.PARTICIPANTS)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (!error) {
      // Invalidate caches
      cacheHelpers.delete('participants_all');
      cacheHelpers.delete('scan_stats');
    }
    
    return { data, error };
  },

  // Volunteer operations
  async getVolunteers(useCache: boolean = true) {
    const cacheKey = 'volunteers_all';
    
    if (useCache) {
      const cached = cacheHelpers.get(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    const { data, error } = await supabaseAdmin
      .from(TABLES.VOLUNTEERS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      cacheHelpers.set(cacheKey, data, 60000); // 1 minute cache
    }
    
    return { data, error };
  },

  async getVolunteerByEmail(email: string, useCache: boolean = true) {
    const cacheKey = `volunteer_email_${email}`;
    
    if (useCache) {
      const cached = cacheHelpers.get(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    const { data, error } = await supabaseAdmin
      .from(TABLES.VOLUNTEERS)
      .select('*')
      .eq('email', email)
      .single();
    
    if (!error && data) {
      cacheHelpers.set(cacheKey, data, 300000); // 5 minutes cache for user lookups
    }
    
    return { data, error };
  },

  async createVolunteer(volunteer: Omit<Volunteer, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.VOLUNTEERS)
      .insert([volunteer])
      .select()
      .single();
    
    if (!error) {
      // Invalidate cache
      cacheHelpers.delete('volunteers_all');
    }
    
    return { data, error };
  },

  // Scan log operations
  async createScanLog(scanLog: Omit<ScanLog, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.SCAN_LOGS)
      .insert([scanLog])
      .select()
      .single();
    
    if (!error) {
      // Invalidate scan-related caches
      cacheHelpers.delete('scan_stats');
    }
    
    return { data, error };
  },

  // Optimized scan statistics with single query
  async getScanStats(useCache: boolean = true) {
    const cacheKey = 'scan_stats';
    
    if (useCache) {
      const cached = cacheHelpers.get(cacheKey);
      if (cached) return cached;
    }

    // Single optimized query instead of multiple queries
    const { data, error } = await supabaseAdmin
      .from(TABLES.PARTICIPANTS)
      .select('status');

    if (error) {
      return {
        total: 0,
        scanned: 0,
        checkedIn: 0,
        registered: 0,
        scanRate: '0'
      };
    }

    const total = data?.length || 0;
    const scannedCount = data?.filter(p => p.status === 'scanned').length || 0;
    const checkedInCount = data?.filter(p => p.status === 'checked-in').length || 0;
    const registeredCount = data?.filter(p => p.status === 'registered').length || 0;

    const stats = {
      total,
      scanned: scannedCount,
      checkedIn: checkedInCount,
      registered: registeredCount,
      scanRate: total > 0 ? (scannedCount / total * 100).toFixed(1) : '0'
    };

    cacheHelpers.set(cacheKey, stats, 15000); // 15 seconds cache for stats
    return stats;
  },

  // Volunteer application operations
  async createVolunteerApplication(application: Omit<VolunteerApplication, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.VOLUNTEER_APPLICATIONS)
      .insert([application])
      .select()
      .single();
    
    return { data, error };
  },

  // Batch operations for better performance
  async batchUpdateParticipantStatus(updates: Array<{ id: string; status: Participant['status'] }>) {
    const { data, error } = await supabaseAdmin
      .from(TABLES.PARTICIPANTS)
      .upsert(
        updates.map(update => ({
          id: update.id,
          status: update.status,
          updated_at: new Date().toISOString()
        }))
      )
      .select();
    
    if (!error) {
      cacheHelpers.delete('participants_all');
      cacheHelpers.delete('scan_stats');
    }
    
    return { data, error };
  }
};

// Optimized real-time subscription helpers with connection pooling
export const realtimeHelpers = {
  subscribeToParticipants(callback: (payload: any) => void) {
    return supabase
      .channel('participants-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.PARTICIPANTS },
        (payload) => {
          // Invalidate cache on changes
          cacheHelpers.delete('participants_all');
          cacheHelpers.delete('scan_stats');
          callback(payload);
        }
      )
      .subscribe();
  },

  subscribeToVolunteers(callback: (payload: any) => void) {
    return supabase
      .channel('volunteers-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.VOLUNTEERS },
        (payload) => {
          // Invalidate cache on changes
          cacheHelpers.delete('volunteers_all');
          callback(payload);
        }
      )
      .subscribe();
  },

  subscribeToScanLogs(callback: (payload: any) => void) {
    return supabase
      .channel('scan-logs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.SCAN_LOGS },
        (payload) => {
          // Invalidate cache on changes
          cacheHelpers.delete('scan_stats');
          callback(payload);
        }
      )
      .subscribe();
  }
};

// Export cache helpers for manual cache management
export { cacheHelpers }; 