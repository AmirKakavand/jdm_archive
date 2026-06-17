/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js to build static files
  output: 'export',
  
  // Disable image optimization (required for static exports)
  images: { unoptimized: true },

  // CRITICAL: Replace 'your-repo-name' with the exact name of your GitHub repository!
  basePath: '/jdm_archive',
  assetPrefix: '/jdm_archive',
};

export default nextConfig;