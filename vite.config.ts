import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'module';
import tsconfigPaths from 'vite-tsconfig-paths';
import tsconfig from './tsconfig.json'

export default defineConfig({
    plugins: [
      tsconfigPaths(),
      dts({
        outDir: tsconfig.compilerOptions.outDir,
        // tsconfigPath: '',
        rollupTypes: true,
      }),
    ],
    build: {
        target: tsconfig.compilerOptions.target,
        outDir: tsconfig.compilerOptions.outDir,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src', 'index.ts'),
            name: '@netglade/vite-plugin-root-redirect',
            // the proper extensions will be added
            fileName: (format) => `vite-plugin-root-redirect.${format}.js`,
            formats: [tsconfig.compilerOptions.module === 'esnext' ? 'es' : 'umd'],
        },
        rollupOptions: {
            external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        }
    },
})
