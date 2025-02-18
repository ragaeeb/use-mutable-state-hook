import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    minify: true,
    external: ['react'],
    target: 'esnext',
    clean: true,
});
