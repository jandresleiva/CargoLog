import type { Transport } from './types';

const registry = new Map<string, (opts: any) => Transport>();

export function registerTransport(name: string, factory: (opts: any) => Transport) {
  if (registry.has(name)) throw new Error(`Transport '${name}' already registered`);
  registry.set(name, factory);
}

export function createTransport(name: string, opts: any): Transport {
  const f = registry.get(name);
  if (!f) throw new Error(`Unknown transport '${name}'`);
  return f(opts);
}