import type { NextConfig } from 'next';
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() { return [
    { source: '/blog', destination: '/', permanent: true },
    { source: '/blog/produto/:slug', destination: '/revestimentos/:slug', permanent: true },
    { source: '/blog/product/:slug', destination: '/revestimentos/:slug', permanent: true },
    { source: '/produto/:slug', destination: '/revestimentos/:slug', permanent: true },
    { source: '/produtos', destination: '/revestimentos', permanent: true },
  ]; },
};
export default config;
