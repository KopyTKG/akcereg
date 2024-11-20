import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getUserInfoV1 } from '@/lib/stag'
import { isAdmin, isStudent } from './lib/functions'
import { decrypt } from './lib/crypto'

export async function middleware(request: NextRequest) {
 // Missing ticket = kick user
 if (!BaseAuth(request)) {
  request.nextUrl.pathname = '/standby'
  return NextResponse.redirect(request.nextUrl)
 }

 // Const for regex filtering
 const { pathname } = request.nextUrl

 // Get ticket from cookies and decrypt it
 const eTicket = request.cookies.get('x-svt')?.value || ''
 const ticket = decrypt(request, eTicket)

 // Missing ticket reload
 if (!ticket) {
  return NextResponse.next()
 }

 // Handle student path matching
 const studentPathMatch = pathname.match(/^\/student\/([^/]+)(\/moje|\/profil)?$/)
 const ucitelPathMatch = pathname.match(
  /^\/ucitel\/([^/]+)(\/termin\/[^/]+|\/hledat+|\/predmety+|\/terminy+)?$/,
 )

 // Get info from stag if not kick user
 const info = await getUserInfoV1(ticket)
 if (!info) {
  request.nextUrl.pathname = '/logout'
  return NextResponse.redirect(request.nextUrl)
 }

 // Route handeling for auth users
 if (isStudent(info) && ucitelPathMatch) {
  request.nextUrl.pathname = '/'
  const res = NextResponse.redirect(request.nextUrl)
  return res
 }

 // Check student poth
 if (studentPathMatch && studentPathMatch[1] === info.id) {
  return NextResponse.next()
 }

 // Check teacher path
 if (ucitelPathMatch && ucitelPathMatch[1] === info.id) {
  const res = NextResponse.next()
  if (info) {
   if (isAdmin(info)) {
    res.cookies.set('x-cvt', 'true', {
     path: '/',
     httpOnly: true,
    })
   } else {
    res.cookies.delete('x-cvt')
   }
  }
  return res
 }

 // Path filtering
 if (pathname === '/') {
  if (isStudent(info)) {
   request.nextUrl.pathname = `/student/${info.id}`
  } else {
   request.nextUrl.pathname = `/ucitel/${info.id}`
  }
  return NextResponse.redirect(request.nextUrl)
 }

 const terminPathMatch = pathname.match(/^\/termin\/([^/]+)$/)
 if (terminPathMatch) {
  const terminID = terminPathMatch[1]
  if (!info.role.includes('ST')) {
   request.nextUrl.pathname = `/ucitel/${info.id}/termin/${terminID}`
   return NextResponse.redirect(request.nextUrl)
  }
 }

 return NextResponse.next()
}

export const config = {
 matcher: [
  {
   source:
    '/((?!login|logout|standby|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  },
  '/student/:path*',
  '/ucitel/:path+',
 ],
}

function BaseAuth(request: NextRequest) {
 if (request.cookies.get('x-svt') && request.cookies.get('x-svt')?.value != '') {
  return true
 } else {
  return false
 }
}
