import { Transport, LogRecord } from '../types';

export class ConsoleTransport implements Transport {
  constructor(public minLevel: Transport['minLevel'] = 'trace'){}
  
  write(r: LogRecord) {
    const ts = new Date(r.time).toISOString();
    const ns = r.ns ? `[${r.ns}]` : '';
    const line = `${ts} ${r.level.toUpperCase()} ${ns} ${r.msg}`;
    const extras = { ...r.context, ...(r.err ? { err: r.err } : {}) };

    const fn = r.level === 'error' || r.level === 'fatal'
      ? console.error : r.level === 'warn'
      ? console.warn  : r.level === 'info'
      ? console.info  : console.log;

    fn(line, Object.keys(extras).length ? extras : undefined);
  }

  async flush(): Promise<void> {
    // Console output is typically unbuffered, but we can ensure 
    // any pending stdout/stderr writes are flushed
    if (typeof process !== 'undefined' && process.stdout) {
      return new Promise((resolve) => {
        process.stdout.write('', (err) => {
          resolve(); // Ignore errors, just resolve
        });
      });
    }
  }

  async close(): Promise<void> {
    // Console transport doesn't need explicit cleanup
    // This is a no-op but implements the interface
    return Promise.resolve();
  }
}