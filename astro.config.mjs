// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import netlify from '@astrojs/netlify/functions';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Usamos path.resolve para garantizar la ruta absoluta
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
  integrations: [icon()],
  image: {
    domains: ['spotcheese.s6-tastewp.com'],
  },
});