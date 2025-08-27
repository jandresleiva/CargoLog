import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

const log = new Logger({
  level: 'debug',
  transports: [
    // Console transport for local debugging
    new ConsoleTransport('debug'),
    
    // HTTP transport to send logs to test endpoint
    new HttpTransport({
      url: '', // UPDATE WITH YOUR HTTP ENDPOINT
      minLevel: 'info',
      batchSize: 5, // Small batch size for demo
      timeout: 10000,
      headers: {
        'X-Demo-App': 'CargoLog-Node-Demo',
        'X-Version': '1.0.0'
      },
      redact: (key, value) => {
        // Redact sensitive information before sending to HTTP endpoint
        if (key === 'password' || key === 'apiKey' || key === 'token') {
          return '[REDACTED]';
        }
        // Mask email addresses
        if (key === 'email' && typeof value === 'string') {
          return value.replace(/(.{2}).*@/, '$1***@');
        }
        // Truncate long stack traces for HTTP logs
        if (key === 'stack' && typeof value === 'string') {
          return value.split('\n').slice(0, 3).join('\n') + '\n... (truncated)';
        }
        return value;
      }
    })
  ],
  namespace: 'node-demo',
  context: { env: 'development', version: '1.0.0' }
});

async function runDemo() {
  console.log('🚀 Starting CargoLog HTTP Transport Demo...\n');
  
  // Generate various log levels
  log.debug('Debug message - only shown in console');
  log.info('Application started successfully');
  log.warn('This is a warning message');
  log.error('Simulated error occurred', { 
    err: new Error('Demo error for testing'),
    context: { userId: 'demo-user', action: 'test-action' }
  });
  
  // Add more logs to trigger batch sending
  for (let i = 1; i <= 3; i++) {
    log.info(`Batch log message ${i}`, { iteration: i, timestamp: Date.now() });
  }
  
  // Demonstrate redaction with sensitive data
  log.warn('User authentication attempt', {
    context: {
      email: 'john.doe@example.com',
      password: 'supersecret123',
      apiKey: 'sk_live_abc123xyz789',
      userId: 'user_12345'
    }
  });
  
  log.error('Database connection failed', {
    err: new Error('Connection timeout after 30 seconds'),
    context: {
      host: 'db.example.com',
      port: 5432,
      token: 'db_token_secret_key',
      retryCount: 3
    }
  });
  
  log.info('Demo completed - flushing remaining logs...');
  
  // Ensure all logs are sent before exit
  await log.flush();
  await log.close();
  
  console.log('\n✅ Demo completed! Check the Beeceptor endpoint for HTTP logs.');
}

runDemo().catch(console.error);
