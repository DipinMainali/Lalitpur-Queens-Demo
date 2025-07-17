/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Increase from the default 1mb to 10mb
    },
  },
};

module.exports = nextConfig;
