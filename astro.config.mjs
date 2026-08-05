// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prashantkhanchandani.github.io',
  // NO base: — this is a user root repo, serves from /
  output: 'static',
  integrations: [sitemap()],
});
