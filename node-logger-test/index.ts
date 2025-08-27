import { Logger } from '@jandresleiva/cargolog';
import { ConsoleTransport } from '@jandresleiva/cargolog/transports/console';

const log = new Logger({
  level: 'debug',
  transports: [new ConsoleTransport('debug')],
  namespace: 'test',
  context: { env: 'local' }
});

log.info('Hello from logger');
log.error('Something broke', { err: new Error('boom') });
