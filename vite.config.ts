import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'module';
import tsconfigPaths from 'vite-tsconfig-paths';

const module = process.env.MODULE || 'esm'

export default defineConfig({
    plugins: [
      tsconfigPaths(),
      dts({
        tsconfigPath: module === 'esm' ? 'tsconfig.json' : 'tsconfig.cjs.json',
        rollupTypes: true,
      }),
    ],
    build: {
        // target: tsconfig.compilerOptions.target,
        target: module === 'esm' ? 'esnext' : 'es2015',
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src', 'index.ts'),
            name: '@netglade/vite-plugin-root-redirect',
            // the proper extensions will be added
            fileName: (format) => `vite-plugin-root-redirect.${format}.js`,
            formats: [module === 'esm' ? 'es' : 'umd'],
        },
        rollupOptions: {
            external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        },
      emptyOutDir: false,
    },
})
