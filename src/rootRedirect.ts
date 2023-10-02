import { PluginOption, ViteDevServer } from 'vite'

export const rootRedirect = (url: string): PluginOption => {
  return {
    name: 'root-redirect',
    apply: 'serve',
    configureServer(server: ViteDevServer): void {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/') {
          res.writeHead(301, { Location: url })
          res.end()
          return
        }
        next()
      })
    },
  }
}
