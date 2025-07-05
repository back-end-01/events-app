import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '../../../../auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/scan - Process QR code scan
export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { qrCode, volunteerId } = await request.json();
    
    // Find participant by QR code
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .eq('qr_code', qrCode)
      .single();
    
    if (participantError || !participant) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Participant not found',
          scanTime: new Date().toISOString()
        },
        { status: 404 }
      );
    }

    // Update participant status to scanned
    const { error: updateError } = await supabase
      .from('participants')
      .update({ status: 'scanned' })
      .eq('id', participant.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to update participant status',
          scanTime: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Log the scan
    const { error: logError } = await supabase
      .from('scan_logs')
      .insert([{
        participant_id: participant.id,
        volunteer_id: volunteerId,
        status: 'success',
        message: `Successfully scanned ${participant.name}`
      }]);

    if (logError) {
      console.error('Log error:', logError);
    }

    // Create scan result
    const scanResult = {
      participantId: participant.id,
      participantName: participant.name,
      scanTime: new Date().toISOString(),
      status: 'success' as const,
      message: `Successfully scanned ${participant.name}`,
      volunteerId
    };

    return NextResponse.json({
      success: true,
      scanResult,
      participant: { ...participant, status: 'scanned' }
    });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process scan',
        scanTime: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET /api/scan/stats - Get scanning statistics
export async function GET() {
  try {
    // Get total participants
    const { count: totalParticipants } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true });

    // Get participants by status
    const { data: participants } = await supabase
      .from('participants')
      .select('status');

    const scannedCount = participants?.filter(p => p.status === 'scanned').length || 0;
    const checkedInCount = participants?.filter(p => p.status === 'checked-in').length || 0;
    const registeredCount = participants?.filter(p => p.status === 'registered').length || 0;

    return NextResponse.json({
      stats: {
        total: totalParticipants || 0,
        scanned: scannedCount,
        checkedIn: checkedInCount,
        registered: registeredCount,
        scanRate: totalParticipants && totalParticipants > 0 ? (scannedCount / totalParticipants * 100).toFixed(1) : '0'
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan statistics' },
      { status: 500 }
    );
  }
} 