// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://05prashant.github.io',
  // NO base: — this is a user root repo, serves from /
  output: 'static',
});
