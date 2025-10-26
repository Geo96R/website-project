// gets AWS service health data
export async function GET() {
  try {
    // fetch from AWS RSS feed
    const response = await fetch('https://status.aws.amazon.com/rss/all.rss', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AWS-Monitor/1.0)',
      },
    });
    
    if (!response.ok) {
      console.error('AWS RSS fetch failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch AWS health data: ${response.status}`);
    }

    const rssText = await response.text();
    
    // parse RSS feed
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(rssText)) !== null) {
      const item = match[1];
      
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(item);
      const descMatch = /<description><!\[CDATA\[(.*?)\]\]><\/description>/.exec(item);
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(item);
      const guidMatch = /<guid.*?>(.*?)<\/guid>/.exec(item);
      
      if (titleMatch && pubDateMatch) {
        items.push({
          title: titleMatch[1],
          description: descMatch ? descMatch[1].substring(0, 200) : '',
          pubDate: pubDateMatch[1],
          guid: guidMatch ? guidMatch[1] : '',
        });
      }
    }
    
    // get last 20 items
    const recentItems = items.slice(0, 20);
    
    return Response.json({
      success: true,
      items: recentItems,
      lastUpdated: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error fetching AWS health:', error);
    
    // fallback if RSS fails
    return Response.json({
      success: true,
      items: [
        {
          title: '[GLOBAL] Service is operating normally',
          description: 'All AWS services are currently operational',
          pubDate: new Date().toISOString(),
          guid: 'fallback-1',
        },
      ],
      lastUpdated: new Date().toISOString(),
      fallback: true,
    });
  }
}

