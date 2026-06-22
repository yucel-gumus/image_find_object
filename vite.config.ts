import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const gatewayTarget = (env.AI_API_URL || env.GEMINI_GATEWAY_URL || 'https://api.yucelgumus.dev').replace(
    /\/$/,
    ''
  );

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api/analyze-image': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.GATEWAY_CLIENT_API_KEY || env.CLIENT_API_KEY;
              if (key) {
                proxyReq.setHeader('X-API-Key', key);
              }
            });
          },
        },
      },
    },
  };
});