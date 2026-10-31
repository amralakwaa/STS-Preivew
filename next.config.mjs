/** @type {import('next').NextConfig} */
// Static export. Set BASE_PATH when the site is served from a sub-folder,
// e.g. BASE_PATH=/STS-Preivew for GitHub Pages; leave it empty on a root domain.
const basePath = process.env.BASE_PATH || '';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  images: { unoptimized: true },
};
export default nextConfig;
