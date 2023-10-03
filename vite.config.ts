import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'module';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
      tsconfigPaths(),
      dts({ rollupTypes: true }),
    ],
    build: {
        target: 'node16',
        // outDir: '../wwwroot/js',
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src', 'index.ts'),
            name: '@netglade/vite-plugin-root-redirect',
            // the proper extensions will be added
            fileName: (format) => `vite-plugin-root-redirect.${format}.js`,
            formats: ['es'],
        },
        rollupOptions: {
            external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        }
    },
})
