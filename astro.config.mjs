// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://daferur-lang.github.io' : 'https://avefenixsoftware.com',
  base: isGitHubPages ? '/avefenix-software' : '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), sitemap()]
});