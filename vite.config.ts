import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function apkMimePlugin(): Plugin {
  const handler = (req: any, res: any, next: any) => {
    const rawUrl = req.url || '';
    const cleanUrl = rawUrl.split('?')[0];
    if (cleanUrl.endsWith('.apk')) {
      const publicPath = path.resolve(__dirname, 'public');
      const filePath = path.join(publicPath, cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
      
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const fileName = path.basename(filePath);
        
        res.writeHead(200, {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': stat.size,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length',
        });
        
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        return;
      }
    }
    next();
  };

  return {
    name: 'apk-mime-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      apkMimePlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'Audio - Apple TV Music',
          short_name: 'Audio',
          description: 'High-fidelity music streaming client with Apple TV design, synced lyrics, and crossfade transitions',
          theme_color: '#FF2A4D',
          background_color: '#050608',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

