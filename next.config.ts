/** @type {import('next').NextConfig} */
const nextConfig = {
  // THIS IS THE CRITICAL LINE THAT CREATES THE 'out' FOLDER
  output: "export",

  basePath: "/jdm_archive",
  assetPrefix: "/jdm_archive",

  images: { unoptimized: true },

  // Add this line while we are here to fix your slowness (explained below)
  reactStrictMode: false,
};

export default nextConfig;
