import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const country = url.searchParams.get('country');
  const genre = url.searchParams.get('genre');
  const search = url.searchParams.get('search');
  
  try {
    // try multiple radio browser endpoints
    const apiEndpoints = [
      'https://de1.api.radio-browser.info',
      'https://de2.api.radio-browser.info', 
      'https://at1.api.radio-browser.info',
      'https://nl1.api.radio-browser.info',
      'https://fr1.api.radio-browser.info'
    ];
    
    let apiUrl;
    if (search) {
    // search by name, country, or tags
      apiUrl = `${apiEndpoints[0]}/json/stations/search?name=${encodeURIComponent(search)}`;
    } else if (country && country !== 'All origins') {
      apiUrl = `${apiEndpoints[0]}/json/stations/bycountry/${encodeURIComponent(country)}`;
    } else if (genre && genre !== 'All genres') {
      apiUrl = `${apiEndpoints[0]}/json/stations/bytag/${encodeURIComponent(genre)}`;
    } else {
      apiUrl = `${apiEndpoints[0]}/json/stations/topclick/200`;
    }
    
    // add query params
    const radioBrowserUrl = new URL(apiUrl);
    radioBrowserUrl.searchParams.set('hidebroken', 'true');
    radioBrowserUrl.searchParams.set('order', 'clickcount');
    radioBrowserUrl.searchParams.set('reverse', 'true');
    radioBrowserUrl.searchParams.set('lastcheckok', '1');
    radioBrowserUrl.searchParams.set('ssl_error', '0');
    radioBrowserUrl.searchParams.set('limit', '200');
    
    console.log('Fetching from Radio Browser API:', radioBrowserUrl.toString());
    console.log('Genre filter:', genre);
    console.log('Country filter:', country);
    
    // try different endpoints if one fails
    let response;
    let lastError;
    
    for (let i = 0; i < apiEndpoints.length; i++) {
      try {
        const currentUrl = radioBrowserUrl.toString().replace(apiEndpoints[0], apiEndpoints[i]);
        console.log(`Trying endpoint ${i + 1}/${apiEndpoints.length}:`, currentUrl);
        
        // Create AbortController for timeout
        const controller = new AbortController();
        // 10 second timeout
        
        response = await fetch(currentUrl, {
          headers: {
            'User-Agent': 'George-DevOps-Radio/1.0',
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`Success with endpoint ${i + 1}`);
          break;
        } else {
          console.log(`Endpoint ${i + 1} failed with status: ${response.status}`);
          lastError = new Error(`Radio Browser API failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`Endpoint ${i + 1} error:`, error.message);
        lastError = error;
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error('All Radio Browser endpoints failed');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response from Radio Browser API');
    }
    
    // filter and format stations
    let formattedStations = data
      .filter(station => {
        return station.url && 
               station.name && 
               station.country &&
               station.lastcheckok === 1 &&
               !station.broken;
      });

    // extra filtering for search
    if (search) {
      const searchLower = search.toLowerCase();
      formattedStations = formattedStations.filter(station => {
        return station.name.toLowerCase().includes(searchLower) ||
               station.country.toLowerCase().includes(searchLower) ||
               (station.tags && station.tags.toLowerCase().includes(searchLower));
      });
    }

    formattedStations = formattedStations
      .slice(0, 200)
      .map((station, index) => ({
        name: station.name,
        country: station.country,
        genre: station.tags ? station.tags.split(',')[0].trim() : 'Music',
        frequency: 87.5 + (index * 0.1),
        bitrate: station.bitrate || 128,
        codec: station.codec || 'MP3',
        tags: station.tags || 'music',
        url: station.url,
        uuid: station.stationuuid,
        clickcount: station.clickcount || 0,
        votes: station.votes || 0
      }));
    
    console.log(`Successfully fetched ${formattedStations.length} stations`);
    
    return NextResponse.json({
      success: true,
      stations: formattedStations,
      count: formattedStations.length,
      country: country || 'all',
      genre: genre || 'all',
      search: search || null
    });
    
  } catch (error) {
    console.error('Radio Browser API error:', error);
    
    // fallback stations
    const fallbackStations = [
      { name: 'BBC World Service', country: 'United Kingdom', genre: 'News', frequency: 87.5, bitrate: 128, codec: 'MP3', tags: 'news, international', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
      { name: 'Radio Paradise', country: 'United States', genre: 'Rock', frequency: 88.1, bitrate: 320, codec: 'AAC', tags: 'rock, alternative, indie', url: 'http://stream.radioparadise.com/aac-320' },
      { name: 'SomaFM Groove Salad', country: 'United States', genre: 'Electronic', frequency: 88.3, bitrate: 128, codec: 'MP3', tags: 'electronic, ambient', url: 'http://ice1.somafm.com/groovesalad-128-mp3' },
      { name: 'SomaFM Beat Blender', country: 'United States', genre: 'Electronic', frequency: 88.5, bitrate: 128, codec: 'MP3', tags: 'electronic, beats', url: 'http://ice1.somafm.com/beatblender-128-mp3' },
      { name: 'SomaFM DEF CON', country: 'United States', genre: 'Electronic', frequency: 88.7, bitrate: 128, codec: 'MP3', tags: 'electronic, techno', url: 'http://ice1.somafm.com/defcon-128-mp3' }
    ];
    
    return NextResponse.json({
      success: false,
      stations: fallbackStations,
      count: fallbackStations.length,
      country: 'fallback',
      error: error.message
    });
  }
}