// @ts-check
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? "https://ragen-ai.github.io";
const base = process.env.SITE_BASE ?? "/";

// https://astro.build/config
export default defineConfig({
    site,
    base,
});
