import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

const log = new Logger({
  level: 'debug',
  transports: [
    // Console transport for local debugging
    new ConsoleTransport('debug'),
    
    // HTTP transport to send logs to test endpoint
    new HttpTransport({
      url: 'https://test-cargolog-http-node.free.beeceptor.com',
      minLevel: 'info',
      batchSize: 5, // Small batch size for demo
      timeout: 10000,
      headers: {
        'X-Demo-App': 'CargoLog-Node-Demo',
        'X-Version': '1.0.0'
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
  
  log.info('Demo completed - flushing remaining logs...');
  
  // Ensure all logs are sent before exit
  await log.flush();
  await log.close();
  
  console.log('\n✅ Demo completed! Check the Beeceptor endpoint for HTTP logs.');
}

runDemo().catch(console.error);
