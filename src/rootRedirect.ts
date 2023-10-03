import { PluginOption, ViteDevServer } from 'vite'

type rootRedirectOptions = {
  url: string
}

export const rootRedirect = (options: rootRedirectOptions): PluginOption => {
  return {
    name: 'vite-plugin-root-redirect',
    apply: 'serve',
    configureServer(server: ViteDevServer): void {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/') {
          res.writeHead(301, { Location: options.url })
          res.end()
          return
        }
        next()
      })
    },
  }
}
