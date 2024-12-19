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
   if (!ticket) return Pass(request)

   const rTicket = encrypt(request, ticket)
   if (rTicket) {
    request.nextUrl.pathname = '/'
    const response = Redirect(request)
    response.cookies.set('x-svt', rTicket, {
     path: '/',
     httpOnly: true,
     sameSite: 'lax',
     secure: process.env.NODE_ENV === 'production',
     maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return response
   } else {
    request.nextUrl.pathname = '/standby'
    const response = Redirect(request)
    const cookies = request.cookies.getAll()
    cookies.forEach((cookie) => {
     response.cookies.delete(cookie.name)
    })
    return response
   }
  }
  return Pass(request)
 }

 if (pathname === '/' && searchParams.has('s')) {
  request.nextUrl.pathname = '/'
  request.nextUrl.search = ''
  return Redirect(request)
 }

 // Handle student path matching
 const studentPathMatch = pathname.match(/^\/student\/([^/]+)(\/moje|\/profil)?$/)
 const ucitelPathMatch = pathname.match(
  /^\/ucitel\/([^/]+)(\/termin\/[^/]+|\/hledat+|\/predmety+|\/terminy+)?$/,
 )

 // Get ticket from cookies and
 const eTicket = request.cookies.get('x-svt')?.value

 if (!eTicket) {
  request.nextUrl.pathname = '/login'
  return Redirect(request)
 }

 // Decrypt ticket
 const ticket = decrypt(request, eTicket)

 // Missing ticket reload
 if (!ticket) {
  request.nextUrl.pathname = '/standby'
  const response = Redirect(request)
  const cookies = request.cookies.getAll()
  cookies.forEach((cookie) => {
   response.cookies.delete(cookie.name)
  })
  return response
 }

 // Get info from stag if not kick user
 const info = await getUserInfoV1(ticket)
 if (!info) {
  request.nextUrl.pathname = '/logout'
  return Redirect(request)
 }

 // Route handeling for auth users
 if (isStudent(info) && ucitelPathMatch) {
  request.nextUrl.pathname = '/'
  return Redirect(request)
 }

 // Check student poth
 if (studentPathMatch && studentPathMatch[1] === info.id) {
  return Pass(request)
 }

 // Check teacher path
 if (ucitelPathMatch && ucitelPathMatch[1] === info.id) {
  const res = Pass(request)
  if (info) {
   if (isAdmin(info)) {
    res.cookies.set('x-cvt', 'true', {
     path: '/',
     secure: true,
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
  return Redirect(request)
 }

 const terminPathMatch = pathname.match(/^\/termin\/([^/]+)$/)
 if (terminPathMatch) {
  const terminID = terminPathMatch[1]
  if (!info.role.includes('ST')) {
   request.nextUrl.pathname = `/ucitel/${info.id}/termin/${terminID}`
   return Redirect(request)
  }
 }
 return Pass(request)
}

function GetCSP() {
 const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

 const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    connect-src 'self' ${process.env.NEXT_PUBLIC_BASE} ;
  `

 const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim()
 return { nonce, contentSecurityPolicyHeaderValue }
}

function Redirect(request: NextRequest): NextResponse {
 const { nonce, contentSecurityPolicyHeaderValue } = GetCSP()
 const requestHeaders = new Headers(request.headers)
 requestHeaders.set('x-nonce', nonce)

 requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

 const response = NextResponse.redirect(new URL(request.nextUrl), {
  headers: requestHeaders,
 })
 response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

 return response
}

function Pass(request: NextRequest): NextResponse {
 const { nonce, contentSecurityPolicyHeaderValue } = GetCSP()
 const requestHeaders = new Headers(request.headers)
 requestHeaders.set('x-nonce', nonce)

 requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

 const response = NextResponse.next({
  request: {
   headers: requestHeaders,
  },
 })
 response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

 return response
}

export const config = {
 matcher: ['/', '/login', '/student/:path*', '/ucitel/:path+', '/termin/:path*'],
}
