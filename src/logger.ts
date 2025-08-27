import { LogLevel, LogRecord, LoggerConfig, SerializedError } from './types';

const order: LogLevel[] = ['trace','debug','info','warn','error','fatal'];
const levelGte = (a: LogLevel, b: LogLevel) => order.indexOf(a) >= order.indexOf(b);

function serializeError(err: unknown): SerializedError {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return { name: 'UnknownError', message: String(err) };
}

export class Logger {
  private cfg: LoggerConfig;

  constructor(cfg: LoggerConfig) { 
    this.cfg = cfg;
  }

  child(extra: Partial<LoggerConfig>) {
    return new Logger({
      ...this.cfg,
      namespace: extra.namespace ?? this.cfg.namespace,
      context: { ...(this.cfg.context||{}), ...(extra.context||{}) },
    });
  }

  private emit(level: LogLevel, msg: string, opts?: { context?: Record<string, unknown>; err?: unknown }) {
    if (!levelGte(level, this.cfg.level)) return;

    const redact = this.cfg.redact ?? ((_, v) => v);
    const ctx = { ...(this.cfg.context||{}), ...(opts?.context||{}) };
    const safeCtx = Object.fromEntries(
      Object.entries(ctx).map(([k,v]) => [k, redact(k, v)])
    );

    const rec: LogRecord = {
      level,
      msg,
      time: Date.now(),
      ns: this.cfg.namespace,
      context: Object.keys(safeCtx).length ? safeCtx : undefined,
      err: opts?.err ? serializeError(opts.err) : undefined,
    };

    for (const t of this.cfg.transports) {
      if (t.minLevel && !levelGte(level, t.minLevel)) continue;
      try { void t.write(rec); } catch {}
    }
  }

  trace(m:string,o?:any){ this.emit('trace',m,o); }
  debug(m:string,o?:any){ this.emit('debug',m,o); }
  info (m:string,o?:any){ this.emit('info', m,o); }
  warn (m:string,o?:any){ this.emit('warn', m,o); }
  error(m:string,o?:any){ this.emit('error',m,o); }
  fatal(m:string,o?:any){ this.emit('fatal',m,o); }

  async flush(): Promise<void> {
    const promises = this.cfg.transports
      .map(t => t.flush?.())
      .filter(p => p !== undefined);
    await Promise.all(promises);
  }

  async close(): Promise<void> {
    const promises = this.cfg.transports
      .map(t => t.close?.())
      .filter(p => p !== undefined);
    await Promise.all(promises);
  }
}