import { useMemo, useRef, useState } from 'react';
import { ns } from './log';
import type { Transport, LogRecord, LogLevel } from '@jandresleiva/cargolog';

// In-memory transport to visualize logs inside the app.
class InMemoryTransport implements Transport {
  public minLevel: LogLevel
  private push: (r: LogRecord) => void

  constructor(minLevel: LogLevel = 'trace', push: (r: LogRecord) => void) {
    this.minLevel = minLevel
    this.push = push
  }

  write(r: LogRecord) { this.push(r) }
}

const levels: LogLevel[] = ['trace','debug','info','warn','error','fatal'];

export default function App() {
  const [namespace, setNamespace] = useState('web:App');
  const [minLevel, setMinLevel] = useState<LogLevel>('debug');
  const [rows, setRows] = useState<LogRecord[]>([]);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  // Create a module logger for the current namespace.
  const log = useMemo(() => ns(namespace), [namespace]);

  // Hook the in-memory transport (kept stable across renders).
  const memory = useMemo(() => new InMemoryTransport(minLevel, r => {
    // keep last 100
    const next = [...rowsRef.current, r].slice(-100);
    setRows(next);
  }), []); // created once

  // Keep min level of memory transport in sync with selection
  useMemo(() => { memory.minLevel = minLevel; }, [minLevel, memory]);

  // Attach memory transport (once) by chaining a child logger
  // so it doesn't affect global transports.
  const viewLog = useMemo(() => log.child({}), [log]);
  useMemo(() => { (viewLog as any).cfg?.transports?.push?.(memory); }, [viewLog, memory]);

  const emitAll = () => {
    log.trace('trace sample', { context: { x: 1 } });
    log.debug('debug sample', { context: { y: 2 } });
    log.info('info sample',  { context: { z: 3 } });
    log.warn('warn sample');
    log.error('error sample', { err: new Error('boom') });
    log.fatal('fatal sample', { err: new Error('kaboom') });
  };

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui', padding: 20, maxWidth: 960, margin: '0 auto' }}>
      <h1>Logger Demo (React + TS)</h1>

      <section style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
        <label>
          <div>Namespace</div>
          <input
            value={namespace}
            onChange={e => setNamespace(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          <div>In-app viewer min level</div>
          <select value={minLevel} onChange={e => setMinLevel(e.target.value as LogLevel)} style={{ width: '100%', padding: 8 }}>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <div style={{ alignSelf: 'end', display: 'flex', gap: 8 }}>
          <button onClick={emitAll}>Emit all levels</button>
          <button onClick={() => setRows([])}>Clear</button>
        </div>
      </section>

      <section style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {levels.map(l => (
          <button key={l} onClick={() => (log as any)[l](`${l} clicked`, { context: { btn: l } })}>
            {l.toUpperCase()}
          </button>
        ))}
        <button onClick={() => log.error('with error', { err: new Error('test error') })}>
          ERROR with stack
        </button>
      </section>

      <h2 style={{ marginTop: 24 }}>In-App Logs (last {rows.length})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={th}>Time</th>
            <th style={th}>Level</th>
            <th style={th}>NS</th>
            <th style={th}>Message</th>
            <th style={th}>Context</th>
            <th style={th}>Error</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice().reverse().map((r, i) => (
            <tr key={i}>
              <td style={td}>{new Date(r.time).toLocaleTimeString()}</td>
              <td style={{...td, textTransform:'uppercase'}}>{r.level}</td>
              <td style={td}>{r.ns ?? ''}</td>
              <td style={td}>{r.msg}</td>
              <td style={td}><pre style={pre}>{r.context ? JSON.stringify(r.context, null, 2) : ''}</pre></td>
              <td style={td}><pre style={pre}>{r.err ? JSON.stringify(r.err, null, 2) : ''}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 16, color: '#666' }}>
        Open DevTools to see console output. If you enabled <code>FetchTransport</code>, POSTs go to <code>/api/logs</code>.
      </p>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px 8px' };
const td: React.CSSProperties = { borderBottom: '1px solid #f0f0f0', verticalAlign: 'top', padding: '6px 8px' };
const pre: React.CSSProperties = { margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
