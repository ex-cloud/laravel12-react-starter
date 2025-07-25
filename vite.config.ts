import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        chunkSizeWarningLimit: 1024, // 1 MB
        rollupOptions: {
          output: {
            manualChunks: {
              // Group berdasarkan kategori atau package
              react: ['react', 'react-dom'],
              inertia: ['@inertiajs/react'],
              shadcn: ['@radix-ui/react-dropdown-menu', 'lucide-react'],
            },
          },
        },
      },
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});
