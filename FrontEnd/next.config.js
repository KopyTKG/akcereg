/** @type {import('next').NextConfig} */
const nextConfig = {
 transpilePackages: ['lucide-react'], // add this
 env: {
  NEXT_PUBLIC_BASE: process.env.NEXT_PUBLIC_BASE,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_TIME_GAP: process.env.NEXT_PUBLIC_TIME_GAP,
  NEXT_PUBLIC_STAG_SERVER: process.env.NEXT_PUBLIC_STAG_SERVER,
 },
}

export default nextConfig
