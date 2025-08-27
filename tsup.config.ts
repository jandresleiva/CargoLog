import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/logger.ts",
    "src/types.ts",
    "src/plugins.ts",
    "src/transports/console.ts"
  ],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: { resolve: true },
  sourcemap: false,
  clean: true,
  splitting: false,
  minify: true,
  treeshake: true,
  target: 'es2019',
  skipNodeModulesBundle: true,
  external: [
    'react', 'react-dom'
  ],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
});
