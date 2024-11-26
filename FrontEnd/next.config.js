const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

/** @type {import('next').NextConfig} */
const nextConfig = {
 transpilePackages: ['lucide-react'],
 env: {
  NEXT_PUBLIC_BASE: process.env.NEXT_PUBLIC_BASE,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_TIME_GAP: process.env.NEXT_PUBLIC_TIME_GAP,
  NEXT_PUBLIC_STAG_SERVER: process.env.NEXT_PUBLIC_STAG_SERVER,
 },
 async headers() {
  return [
   {
    source: '/:path*',
    headers: [
     {
      key: 'Access-Control-Allow-Origin',
      value: '*',
     },
     {
      key: 'Access-Control-Allow-Methods',
      value: 'GET, POST, PUT, DELETE, OPTIONS',
     },
     {
      key: 'Access-Control-Allow-Headers',
      value: 'Content-Type, Authorization',
     },
     {
      key: 'Content-Security-Policy',
      value: cspHeader.replace(/\n/g, ''),
     },
     {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN',
     },
     {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
     },
     {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
     },
     {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
     },
    ],
   },
  ]
 },
}

export default nextConfig
