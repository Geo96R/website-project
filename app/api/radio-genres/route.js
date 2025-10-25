import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://de1.api.radio-browser.info/json/tags', {
      headers: {
        'User-Agent': 'George-DevOps-Radio/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Radio Browser API failed: ${response.status}`);
    }

    const tags = await response.json();
    const genres = tags.map(tag => tag.name).sort();

    return NextResponse.json({
      success: true,
      genres: genres
    });

  } catch (error) {
    console.error('Error fetching genres:', error);
    
    // Fallback genres
    const fallbackGenres = [
      'Alternative', 'Ambient', 'Blues', 'Classical', 'Country', 'Dance', 'Electronic', 'Folk',
      'Funk', 'Gospel', 'Hip Hop', 'Jazz', 'Latin', 'Metal', 'News', 'Pop', 'Punk', 'R&B',
      'Reggae', 'Rock', 'Soul', 'Techno', 'Trance', 'World', 'Talk', 'Sports', 'Religious',
      'Children', 'Comedy', 'Educational', 'Oldies', 'Indie', 'Experimental'
    ];

    return NextResponse.json({
      success: false,
      genres: fallbackGenres
    });
  }
}
