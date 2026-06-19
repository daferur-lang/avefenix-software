// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://avefenixsoftware.com',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), sitemap()]
});