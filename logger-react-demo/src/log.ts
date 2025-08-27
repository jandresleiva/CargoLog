import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';

// Base logger (shared config). No hard binding of namespace here.
export const baseLog = new Logger({
  level: import.meta.env.PROD ? 'info' : 'debug',
  transports: [
    new ConsoleTransport('debug'),
    // Comment out if you don't have a receiver yet:
    // new FetchTransport('/api/logs', 10, 400, 'warn')
  ],
  context: { version: (globalThis as any).__APP_VERSION__ ?? 'dev' }
});

// Per-module convenience: derive namespaced loggers
export const ns = (namespace: string) => baseLog.child({ namespace });
