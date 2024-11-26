import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
 return {
  name: 'UJEP AkceReg - registrační systém na mimorozvrhové akce',
  short_name: 'UJEP AkceReg',
  description: 'Registrační systém na mimo rozvrhové akce',
  start_url: '/',
  display: 'standalone',
  background_color: '#fff',
  theme_color: '#fff',
  orientation: 'any',
  categories: ['education', 'productivity'],
  lang: 'cs',
  prefer_related_applications: false,
  icons: [
   {
    src: '/favicon-16x16.png',
    sizes: '16x16',
    type: 'image/png',
   },
   {
    src: '/favicon-32x32.png',
    sizes: '32x32',
    type: 'image/png',
   },
   {
    src: '/favicon-48x48.png',
    sizes: '48x48',
    type: 'image/png',
   },
   {
    src: '/favicon-96x96.png',
    sizes: '96x96',
    type: 'image/png',
   },
   {
    src: '/favicon-192x192.png',
    sizes: '192x192',
    type: 'image/png',
   },
  ],
 }
}
