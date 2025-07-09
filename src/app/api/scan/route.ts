import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { supabaseHelpers } from '../../../lib/supabase';

// POST /api/scan - Process QR code scan (Optimized)
export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { qrCode, volunteerId } = await request.json();
    
    if (!qrCode) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'QR code is required',
          scanTime: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Find participant by QR code (with caching)
    const { data: participant, error: participantError } = await supabaseHelpers.getParticipantByQR(qrCode);
    
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

    // Check if already scanned
    if (participant.status === 'scanned') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Participant already scanned',
          scanTime: new Date().toISOString(),
          participant
        },
        { status: 409 }
      );
    }

    // Update participant status to scanned (with cache invalidation)
    const { error: updateError } = await supabaseHelpers.updateParticipantStatus(participant.id, 'scanned');

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

    // Log the scan (non-blocking)
    const scanTime = new Date().toISOString();
    supabaseHelpers.createScanLog({
      participant_id: participant.id,
      volunteer_id: volunteerId,
      status: 'success',
      scan_time: scanTime,
      message: `Successfully scanned ${participant.name}`
    }).catch(error => {
      console.error('Scan log error (non-blocking):', error);
    });

    // Create scan result
    const scanResult = {
      participantId: participant.id,
      participantName: participant.name,
      scanTime,
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

// GET /api/scan/stats - Get scanning statistics (Optimized)
export async function GET() {
  try {
    // Use optimized helper with caching
    const stats = await supabaseHelpers.getScanStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan statistics' },
      { status: 500 }
    );
  }
} 