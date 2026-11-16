import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function portalApiPlugin(): Plugin {
  const dataFilePath = path.resolve(__dirname, 'src/data/portalData.json');

  const handleApi = (req: any, res: any, next: any) => {
    if (req.url === '/api/portal-data' && req.method === 'GET') {
      try {
        if (!fs.existsSync(dataFilePath)) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Data file not found' }));
          return;
        }
        const content = fs.readFileSync(dataFilePath, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(content);
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    if (req.url === '/api/portal-data' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFileSync(dataFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ success: true, updated: Date.now() }));
          return;
        } catch (err: any) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
          return;
        }
      });
      return;
    }

    next();
  };

  return {
    name: 'portal-api-plugin',
    configureServer(server) {
      server.middlewares.use(handleApi);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApi);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), portalApiPlugin()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
});
