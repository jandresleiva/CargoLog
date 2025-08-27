import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

// Base logger (shared config). No hard binding of namespace here.
export const baseLog = new Logger({
  level: import.meta.env.PROD ? 'info' : 'debug',
  transports: [
    new ConsoleTransport('debug'),
    // HTTP transport to send logs to test endpoint
    new HttpTransport({
      url: 'https://test-cargolog-http-node.free.beeceptor.com',
      minLevel: 'warn', // Only send warnings and errors to HTTP in browser
      batchSize: 10,
      timeout: 8000,
      headers: {
        'X-Demo-App': 'CargoLog-React-Demo',
        'X-Environment': import.meta.env.PROD ? 'production' : 'development'
      }
    })
  ],
  context: { 
    version: (globalThis as any).__APP_VERSION__ ?? 'dev',
    platform: 'browser'
  }
});

// Per-module convenience: derive namespaced loggers
export const ns = (namespace: string) => baseLog.child({ namespace });
