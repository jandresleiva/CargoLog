import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

// Example 1: Using multiple transports together
const logger = new Logger({
  level: 'info',
  namespace: 'my-app',
  transports: [
    // Built-in console transport for development
    new ConsoleTransport('debug'),
    
    // Plugin HTTP transport for production logging
    new HttpTransport({
      url: 'https://logs.example.com/api/ingest',
      minLevel: 'warn', // Only send warnings and errors to HTTP
      batchSize: 50,
      timeout: 10000,
      headers: {
        'Authorization': 'Bearer your-api-token',
        'X-App-Version': '1.0.0'
      }
    })
  ]
});

// Example 2: Environment-specific configuration
function createLogger(environment: 'development' | 'production') {
  const transports = [new ConsoleTransport()];
  
  if (environment === 'production') {
    transports.push(
      new HttpTransport({
        url: process.env.LOG_ENDPOINT!,
        minLevel: 'info',
        headers: {
          'Authorization': `Bearer ${process.env.LOG_TOKEN}`,
        }
      })
    );
  }
  
  return new Logger({
    level: environment === 'development' ? 'debug' : 'info',
    transports
  });
}

// Usage examples
async function main() {
  logger.info('Application started');
  logger.warn('This is a warning that will go to both console and HTTP');
  logger.error('This error will definitely be sent to your logging service');
  
  // Make sure all logs are flushed before exit
  await logger.flush();
  await logger.close();
}

main().catch(console.error);
