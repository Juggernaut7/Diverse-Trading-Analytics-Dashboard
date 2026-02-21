/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_DERIVERSE_PROGRAM_ID: process.env.NEXT_PUBLIC_DERIVERSE_PROGRAM_ID,
  },
};

export default nextConfig
