/** @type {import('next').NextConfig} */
const nextConfig = {
     reactStrictMode: true,
     eslint: {
          ignoreDuringBuilds: true,
     },
     productionBrowserSourceMaps: true,
     images: {
          remotePatterns: [
               {
                    protocol: 'https',
                    hostname: 'via.placeholder.com',
               },
          ],
          // Allow all external images in development, restrict in production
          unoptimized: false,
     },
     webpack: (config) => {
          config.resolve.fallback = {
               ...config.resolve.fallback,
               fs: false,
          };
          return config;
     },
}

module.exports = nextConfig 