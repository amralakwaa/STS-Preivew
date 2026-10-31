/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Relative asset paths so the static export works from any folder.
  assetPrefix: isProd ? '.' : undefined,
  images: { unoptimized: true },
};
export default nextConfig;
