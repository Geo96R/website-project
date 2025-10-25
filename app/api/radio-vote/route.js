import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { stationUuid } = await request.json();
    
    if (!stationUuid) {
      return NextResponse.json({ error: 'Station UUID required' }, { status: 400 });
    }

    // Vote for station with Radio Browser API
    const response = await fetch(`https://de1.api.radio-browser.info/json/vote/${stationUuid}`, {
      method: 'POST',
      headers: {
        'User-Agent': 'George-DevOps-Radio/1.0',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Voting failed:', response.status);
      return NextResponse.json({ success: false, error: 'Voting failed' });
    }

  } catch (error) {
    console.error('Error voting for station:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
