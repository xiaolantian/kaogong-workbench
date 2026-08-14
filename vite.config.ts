import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function RssProxyPlugin() {
  return {
    name: 'rss-proxy',
    configureServer(server) {
      server.middlewares.use('/api/fetch-rss', async (req, res, next) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
        const targetUrl = url.searchParams.get('url')
        if (!targetUrl) {
          res.writeHead(400, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing url param' }))
          return
        }
        try {
          const resp = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/rss+xml, application/xml, text/xml, */*',
            },
            signal: AbortSignal.timeout(20000),
          })
          const text = await resp.text()
          res.writeHead(200, {
            'content-type': 'application/xml; charset=utf-8',
            'access-control-allow-origin': '*',
            'access-control-allow-headers': '*',
          })
          res.end(text)
        } catch (e: any) {
          res.writeHead(502, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ error: e.message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), RssProxyPlugin()],
  server: {
    port: 5173,
    watch: {
      ignored: ['**/src-tauri/target/**']
    },
    cors: true,
  },
  build: { target: 'es2020' }
})