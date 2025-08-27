import { Transport, LogRecord, LogLevel } from '@jandresleiva/cargolog';

export type RedactionFunction = (key: string, value: unknown) => unknown;

export interface HttpTransportOptions {
  url: string;
  minLevel?: LogLevel;
  batchSize?: number;
  timeout?: number;
  headers?: Record<string, string>;
  redact?: RedactionFunction;
}

export class HttpTransport implements Transport {
  private buffer: LogRecord[] = [];
  public readonly minLevel?: LogLevel;
  private readonly url: string;
  private readonly batchSize: number;
  private readonly timeout: number;
  private readonly headers: Record<string, string>;
  private readonly redact?: RedactionFunction;

  constructor(options: HttpTransportOptions) {
    this.url = options.url;
    this.minLevel = options.minLevel;
    this.batchSize = options.batchSize ?? 100;
    this.timeout = options.timeout ?? 5000;
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    this.redact = options.redact;
  }

  write(record: LogRecord): void {
    const redactedRecord = this.redact ? this.applyRedaction(record) : record;
    this.buffer.push(redactedRecord);
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  private applyRedaction(record: LogRecord): LogRecord {
    if (!this.redact) return record;

    const redactedRecord: LogRecord = { ...record };

    // Redact context if present
    if (record.context) {
      redactedRecord.context = this.redactObject(record.context);
    }

    // Redact error if present
    if (record.err) {
      redactedRecord.err = this.redactError(record.err);
    }

    return redactedRecord;
  }

  private redactObject(obj: Record<string, unknown>): Record<string, unknown> {
    if (!this.redact) return obj;

    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      redacted[key] = this.redact(key, value);
    }
    return redacted;
  }

  private redactError(err: { name: string; message: string; stack?: string }): { name: string; message: string; stack?: string } {
    if (!this.redact) return err;

    return {
      name: this.redact('name', err.name) as string,
      message: this.redact('message', err.message) as string,
      stack: err.stack ? this.redact('stack', err.stack) as string : undefined
    };
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const batch = [...this.buffer];
    this.buffer = [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(batch),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
    } catch (error) {
      // In case of error, we could implement retry logic or dead letter queue
      // For now, we'll just silently fail to avoid breaking the application
      console.error('HttpTransport: Failed to send logs', error);
    }
  }

  async close(): Promise<void> {
    await this.flush();
  }
}
