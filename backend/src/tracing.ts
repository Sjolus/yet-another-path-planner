import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

const isEnabled = process.env.OTEL_EXPORTER_OTLP_ENDPOINT !== undefined;

if (isEnabled) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

  const sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME || 'yapp-backend',
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('OpenTelemetry SDK shut down'))
      .catch((err) => console.error('Error shutting down OTel SDK', err))
      .finally(() => process.exit(0));
  });
}
