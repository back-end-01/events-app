import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '../../../../auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { duty_id, reason } = await request.json();
  const { id, name, email } = user;
  const { data, error } = await supabase
    .from('volunteer_applications')
    .insert([
      {
        user_id: id,
        name,
        email,
        duty_id,
        reason,
        status: 'pending',
      },
    ]);
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 201 });
} 