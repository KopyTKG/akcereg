import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getUserInfoV1 } from '@/lib/stag'
import { isAdmin, isStudent } from '@/lib/functions'
import { decrypt, encrypt } from '@/lib/crypto'

export async function middleware(request: NextRequest) {
 // Const for regex filtering
 const { pathname } = request.nextUrl

 const searchParams = new URL(request.url).searchParams

 // login from STAG
 if (pathname === '/login') {
  if (searchParams.has('stagUserTicket')) {
   const ticket = searchParams.get('stagUserTicket')
   if (!ticket) return NextResponse.next()

   const rTicket = encrypt(request, ticket)
   const response = NextResponse.redirect(new URL('/', request.url))
   response.cookies.set('x-svt', rTicket, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
   })
   return response
  }
  return NextResponse.next()
 }

 if (pathname === '/' && searchParams.has('s')) {
  request.nextUrl.pathname = '/'
  request.nextUrl.search = ''
  return NextResponse.redirect(request.nextUrl)
 }

 // Handle student path matching
 const studentPathMatch = pathname.match(/^\/student\/([^/]+)(\/moje|\/profil)?$/)
 const ucitelPathMatch = pathname.match(
  /^\/ucitel\/([^/]+)(\/termin\/[^/]+|\/hledat+|\/predmety+|\/terminy+)?$/,
 )

 // Get ticket from cookies and
 const eTicket = request.cookies.get('x-svt')?.value

 if (!eTicket) {
  return NextResponse.redirect(new URL('/login', request.url))
 }

 // Decrypt ticket
 const ticket = decrypt(request, eTicket)

 // Missing ticket reload
 if (!ticket) {
  return NextResponse.redirect(request.url)
 }

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
   } else if (res.cookies.has('x-cvt')) {
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
 matcher: ['/', '/login', '/student/:path*', '/ucitel/:path+', '/termin/:path*'],
}
