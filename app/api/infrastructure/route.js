import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return infrastructure metadata
    // Note: For security, we don't expose actual cluster data
    // This is static metadata about the infrastructure stack
    const infrastructureData = {
      success: true,
      components: [
        {
          name: 'K3s Cluster',
          status: 'operational',
          description: 'Lightweight Kubernetes distribution',
        },
        {
          name: 'Contour',
          status: 'operational',
          description: 'Gateway API controller',
        },
        {
          name: 'Gateway API',
          status: 'operational',
          description: 'Kubernetes networking standard',
        },
        {
          name: 'Envoy Proxy',
          status: 'operational',
          description: 'High-performance proxy',
        },
        {
          name: 'Terraform',
          status: 'operational',
          description: 'Infrastructure as Code',
        },
        {
          name: 'Grafana Cloud',
          status: 'operational',
          description: 'Observability platform',
        },
      ],
      architecture: {
        flow: [
          'Internet',
          'Cloudflare (WAF, DNS, SSL)',
          'Contour/Envoy Gateway',
          'K3s Cluster',
          'Application Pods',
        ],
        security: [
          'Cloudflare WAF (Edge Protection)',
          'Network Policies (Pod Isolation)',
          'Security Contexts (Non-Root, Dropped Capabilities)',
          'Security Headers (CSP, X-Frame-Options)',
        ],
      },
    };

    return NextResponse.json(infrastructureData);
  } catch (error) {
    console.error('Infrastructure API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch infrastructure data' },
      { status: 500 }
    );
  }
}

