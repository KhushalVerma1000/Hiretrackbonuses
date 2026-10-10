/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() { return [{ source: "/bonuses", destination: "/", permanent: true }]; },
};
export default nextConfig;
