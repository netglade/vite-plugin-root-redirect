import { PluginOption, ViteDevServer } from 'vite'

type rootRedirectOptions = {
  url: string
}

export const rootRedirect = (options: rootRedirectOptions): PluginOption => {
  const { url } = options
  const urlIsAbsolute = url.startsWith('http://') || url.startsWith('https://')

  return {
    name: 'vite-plugin-root-redirect',
    apply: 'serve',
    configureServer(server: ViteDevServer): void {
      const host = server.config.server?.host || 'localhost'
      const port = server.config.server?.port || 5137
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
