import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
//import path from 'path';

export default defineConfig({
   
       // server: {
         /* proxy: {
            '/api': {
              target: 'http://localhost:8000',
              changeOrigin: true,
            },
          },
        },*/
     base: process.env.ASSET_URL ? new URL(process.env.ASSET_URL).origin + '/' : '/',
    plugins: [
        laravel({
            input: [
               // 'resources/css/app.css',  // Ajoutez votre fichier CSS si vous en avez un
                'resources/js/App.jsx'    // Notez le changement de .js à .jsx
            ],
            refresh: true,
        }),
        react(),
    ],
    /*resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },*/
});
