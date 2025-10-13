import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  sourcemap: false,
  target: 'node20',
  outDir: 'dist',
  shims: true,
})
