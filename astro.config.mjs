// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://prashant-khanchandani.info',
  // NO base: — this is a user root repo, serves from /
  output: 'static',
});
