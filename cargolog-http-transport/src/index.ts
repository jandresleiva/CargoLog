import { Transport, LogRecord, LogLevel } from '@jandresleiva/cargolog';

export interface HttpTransportOptions {
  url: string;
  minLevel?: LogLevel;
  batchSize?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpTransport implements Transport {
  private buffer: LogRecord[] = [];
  public readonly minLevel?: LogLevel;
  private readonly url: string;
  private readonly batchSize: number;
  private readonly timeout: number;
  private readonly headers: Record<string, string>;

  constructor(options: HttpTransportOptions) {
    this.url = options.url;
    this.minLevel = options.minLevel;
    this.batchSize = options.batchSize ?? 100;
    this.timeout = options.timeout ?? 5000;
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
  }

  write(record: LogRecord): void {
    this.buffer.push(record);
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
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
