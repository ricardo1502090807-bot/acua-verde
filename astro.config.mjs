// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import netlify from '@astrojs/netlify/functions';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Necesario para que funcione el adaptador
  adapter: netlify(), // Aquí configuramos el adaptador
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon()],
  image: {
    domains: ['spotcheese.s6-tastewp.com'],
  },
});