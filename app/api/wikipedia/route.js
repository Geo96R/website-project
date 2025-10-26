import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const topic = url.searchParams.get('topic');

  if (!topic) {
    return NextResponse.json({
      success: false,
      error: 'Topic parameter is required'
    });
  }

  try {
    // handle topic disambiguation for devops stuff
    const disambiguatedTopic = disambiguateTopic(topic);
    
    // use wikipedia text extraction API
    const textUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(disambiguatedTopic)}`;
    const extractUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(disambiguatedTopic)}`;
    
    console.log('Fetching Wikipedia content for:', disambiguatedTopic);
    
    // get summary first
    let response = await fetch(textUrl, {
      headers: {
        'User-Agent': 'George-DevOps-Learn/1.0 (https://website-project.com)',
        'Accept': 'application/json',
      },
    });

    let content = '';
    let title = topic;
    let url = null;

    if (response.ok) {
      const data = await response.json();
      content = data.extract || '';
      title = data.title || topic;
      url = data.content_urls?.desktop?.page || null;
      
      // try to get more content if summary is short
      if (content && content.length < 500) {
        // try to get more content from full page
        const fullPageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=false&explaintext=true&titles=${encodeURIComponent(topic)}`;
        
        try {
          const fullResponse = await fetch(fullPageUrl, {
            headers: {
              'User-Agent': 'George-DevOps-Learn/1.0 (https://website-project.com)',
              'Accept': 'application/json',
            },
          });
          
          if (fullResponse.ok) {
            const fullData = await fullResponse.json();
            const pages = fullData.query?.pages;
            if (pages) {
              const pageData = Object.values(pages)[0];
              if (pageData?.extract) {
                content = pageData.extract;
              }
            }
          }
        } catch (err) {
          console.log('could not get full content, using summary');
        }
      }
    } else {
      throw new Error(`Wikipedia API failed: ${response.status}`);
    }
    
    // format content for learning platform
    let formattedContent = `${title}\n\n`;
    
    if (content && content.length > 100) {
      // only add real content if substantial
      formattedContent += cleanContent(content);
      
      // add learn more link
      if (url) {
        formattedContent += `\n\nLEARN MORE\n\n`;
        formattedContent += `Read the full Wikipedia article: ${url}\n`;
      }
    } else {
      // if no content, return error
      return NextResponse.json({
        success: false,
        content: `ERROR: Could not find substantial content for "${topic}". Please try another topic.`,
        title: topic,
        url: null
      });
    }
    
    return NextResponse.json({
      success: true,
      content: formattedContent,
      title: title,
      url: url
    });
    
  } catch (error) {
    console.error('Wikipedia API error:', error);
    
    // fallback content
    const fallbackContent = `# ${topic}\n\n## Overview\n\nThis is a comprehensive learning resource for ${topic} in the context of DevOps and system administration.\n\n## Key Concepts\n\n- Core principles and fundamentals\n- Implementation strategies\n- Best practices and patterns\n- Integration with other tools\n\n## Learning Path\n\n1. **Foundation:** Understand the basics\n2. **Implementation:** Hands-on practice\n3. **Advanced:** Optimization and scaling\n4. **Integration:** Connect with other systems\n\n## Resources\n\n- Official documentation\n- Community resources\n- Practical examples\n- Case studies\n\n*Note: This content is generated for learning purposes. For the most up-to-date information, refer to official documentation.*`;
    
    return NextResponse.json({
      success: true,
      content: fallbackContent,
      title: topic,
      fallback: true
    });
  }
}

// Helper function to extract text from HTML
function extractTextFromHTML(html) {
  // Remove all HTML tags and attributes
  let text = html.replace(/<[^>]*>/g, ' ');
  
  // Remove CSS class names and IDs that might be in the text
  text = text.replace(/\.\w+(-\w+)*/g, '');
  text = text.replace(/#\w+(-\w+)*/g, '');
  
  // Remove media queries and CSS
  text = text.replace(/@media[^{]*\{[^}]*\}/g, '');
  text = text.replace(/\.\w+[^{]*\{[^}]*\}/g, '');
  
  // Remove Wikipedia-specific formatting
  text = text.replace(/\.mw-parser-output[^}]*\}/g, '');
  text = text.replace(/\.infobox[^}]*\}/g, '');
  text = text.replace(/\.navbar[^}]*\}/g, '');
  
  // Clean up multiple spaces, newlines, and special characters
  text = text.replace(/\s+/g, ' ').trim();
  text = text.replace(/[^\w\s.,!?;:()-]/g, ' '); // Keep only basic punctuation
  
  // Remove any remaining CSS or HTML artifacts
  text = text.replace(/\b(html|body|div|span|class|id|style|width|height|padding|margin|background|color|font|display|table|row|group|cell|header|footer|nav|menu|button|input|form|label|select|option|textarea|img|src|alt|href|link|script|meta|title|head|body|html)\b/g, '');
  
  // Clean up again after removing keywords
  text = text.replace(/\s+/g, ' ').trim();
  
  // Limit length to reasonable size
  if (text.length > 2000) {
    text = text.substring(0, 2000) + '...';
  }
  
  return text;
}

// Helper function to clean content
function cleanContent(content) {
  // Remove excessive markdown formatting
  content = content.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
  content = content.replace(/\*([^*]+)\*/g, '$1'); // Remove italic
  content = content.replace(/#{1,6}\s*/g, ''); // Remove headers
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links
  content = content.replace(/`([^`]+)`/g, '$1'); // Remove code formatting
  content = content.replace(/\n{3,}/g, '\n\n'); // Remove excessive newlines
  return content;
}

// Helper function to determine if a topic is DevOps-related
function isDevOpsRelated(topic) {
  const devopsKeywords = [
    'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab',
    'aws', 'azure', 'gcp', 'monitoring', 'logging', 'security', 'automation',
    'ci/cd', 'infrastructure', 'cloud', 'container', 'microservice',
    'devops', 'sre', 'reliability', 'scalability', 'performance'
  ];
  
  const topicLower = topic.toLowerCase();
  return devopsKeywords.some(keyword => topicLower.includes(keyword));
}

// Helper function to disambiguate topics for DevOps context
function disambiguateTopic(topic) {
  const disambiguationMap = {
    'Docker': 'Docker (software)',
    'Kubernetes': 'Kubernetes',
    'Terraform': 'Terraform (software)',
    'Ansible': 'Ansible (software)',
    'Jenkins': 'Jenkins (software)',
    'Prometheus': 'Prometheus (software)',
    'Grafana': 'Grafana',
    'Python': 'Python (programming language)',
    'Bash': 'Bash (Unix shell)',
    'Git': 'Git',
    'Linux': 'Linux',
    'Helm': 'Helm (package manager)',
    'Istio': 'Istio (service mesh)',
    'Traefik': 'Traefik (software)',
    'Consul': 'Consul (software)',
    'Vault': 'Vault (software)',
    'Nomad': 'Nomad (scheduler)',
    'Packer': 'Packer (software)',
    'Vagrant': 'Vagrant (software)',
    'Chef': 'Chef (software)',
    'Puppet': 'Puppet (software)',
    'SaltStack': 'SaltStack',
    'Pulumi': 'Pulumi',
    'CloudFormation': 'AWS CloudFormation',
    'ARM Templates': 'Azure Resource Manager',
    'Elasticsearch': 'Elasticsearch',
    'Logstash': 'Logstash',
    'Kibana': 'Kibana',
    'Splunk': 'Splunk',
    'Datadog': 'Datadog',
    'New Relic': 'New Relic',
    'Jaeger': 'Jaeger (software)',
    'Zipkin': 'Zipkin (software)',
    'OpenTelemetry': 'OpenTelemetry',
    'Fluentd': 'Fluentd',
    'Fluent Bit': 'Fluent Bit',
    'Telegraf': 'Telegraf',
    'InfluxDB': 'InfluxDB',
    'TimescaleDB': 'TimescaleDB',
    'Redis': 'Redis',
    'MongoDB': 'MongoDB',
    'PostgreSQL': 'PostgreSQL',
    'MySQL': 'MySQL',
    'Cassandra': 'Apache Cassandra',
    'Kafka': 'Apache Kafka',
    'RabbitMQ': 'RabbitMQ',
    'ActiveMQ': 'Apache ActiveMQ',
    'Nginx': 'Nginx',
    'Apache': 'Apache HTTP Server',
    'HAProxy': 'HAProxy',
    'Envoy': 'Envoy (software)',
    'Linkerd': 'Linkerd'
  };
  
  return disambiguationMap[topic] || topic;
}
