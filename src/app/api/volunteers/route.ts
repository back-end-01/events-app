import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '../../../../auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/volunteers - Get all volunteers
export async function GET(request: Request) {
  // Check if this is a request to /api/volunteers/me
  if (request.url.endsWith('/me')) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return new Response(JSON.stringify({ isVolunteer: false }), { status: 200 });
    }
    const { email } = user;
    console.log("Checking volunteer for email:", email);
    const { data, error } = await supabase
      .from('volunteers')
      .select('email')
      .eq('email', email)
      .single();
    if (error || !data) {
      return new Response(JSON.stringify({ isVolunteer: false }), { status: 200 });
    }
    return new Response(JSON.stringify({ isVolunteer: true }), { status: 200 });
  }
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch volunteers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ volunteers: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}

// POST /api/volunteers - Create new volunteer
export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { phone } = await request.json();
  const { id, name, email } = user;

  const { data, error } = await supabase
    .from('volunteers')
    .upsert([
      {
        name,
        email,
        phone,
        status: 'active',
      },
    ], { onConflict: 'email' });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
} 