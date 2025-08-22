import fs from 'node:fs';
import { EOL } from 'node:os';
import { Transport, LogRecord } from '../types';

export class FileTransport implements Transport {
  constructor(private path: string, public minLevel: Transport['minLevel'] = 'info'){}
  write(r: LogRecord) {
    fs.appendFile(this.path, JSON.stringify(r) + EOL, () => {});
  }
}