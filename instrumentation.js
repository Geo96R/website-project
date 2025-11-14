export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node')
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-otlp-http')
    const { Resource } = await import('@opentelemetry/resources')
    const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions')
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node')

    const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    if (!otlpEndpoint) {
      console.warn('OTEL_EXPORTER_OTLP_ENDPOINT not set, telemetry disabled')
      return
    }

    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'website-project',
        [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
      }),
      traceExporter: new OTLPTraceExporter({
        url: `${otlpEndpoint}/v1/traces`,
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-http': {
            enabled: true,
          },
        }),
      ],
    })

    sdk.start()
    console.log('OpenTelemetry instrumentation started - sending to:', otlpEndpoint)
  }
}

