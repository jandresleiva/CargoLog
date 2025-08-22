import { Logger } from 'my-logger';
import { ConsoleTransport } from 'my-logger';

const log = new Logger({
  level: 'debug',
  transports: [new ConsoleTransport('debug')],
  namespace: 'test',
  context: { env: 'local' }
});

log.info('Hello from logger');
log.error('Something broke', { err: new Error('boom') });
