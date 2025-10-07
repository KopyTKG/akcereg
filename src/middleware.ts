import { NextResponse, NextRequest } from 'next/server'
import { getAuth } from '@/lib/stag_server'
import { isAdmin, isStudent } from '@/lib/functions'
import { decrypt, encrypt, getHash } from '@/lib/crypto'

export async function middleware(request: NextRequest) {
 // Const for regex filtering
 const { pathname } = request.nextUrl

 const searchParams = new URL(request.url).searchParams
 let info = null
 // login from STAG
 if (pathname === '/login') {
  if (searchParams.has('stagUserTicket')) {
   const ticket = searchParams.get('stagUserTicket')
   if (!ticket) return NextResponse.next()

   const rTicket = encrypt(ticket)
   const ticketHash = getHash(ticket)

   if (rTicket) {
    const response = NextResponse.redirect(new URL('/', request.url))
    // Set x-svt (STAG verification ticket)
    response.cookies.set('x-svt', rTicket, {
     path: '/',
     httpOnly: true,
     sameSite: 'lax',
     secure: process.env.NODE_ENV === 'production',
     maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    // Set x-svh (STAG verification hash)
    response.cookies.set('x-svh', ticketHash, {
     path: '/',
     httpOnly: true,
     sameSite: 'lax',
     secure: process.env.NODE_ENV === 'production',
     maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    // set x-cvt (is admin)
    info = await getAuth(ticket)
    if (info && isAdmin(info)) {
     response.cookies.set('x-cvt', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
     })
    }
    return response
   } else {
    const response = NextResponse.redirect(new URL('/standby', request.url))
    const cookies = request.cookies.getAll()
    cookies.forEach((cookie) => {
     response.cookies.delete(cookie.name)
    })
    return response
   }
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
 const ticket = decrypt(eTicket)

 // Missing ticket reload
 if (!ticket) {
  const response = NextResponse.redirect(new URL('/standby', request.url))
  const cookies = request.cookies.getAll()
  cookies.forEach((cookie) => {
   response.cookies.delete(cookie.name)
  })
  return response
 }

 // Get info from stag if not kick user
 info = await getAuth(ticket)
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
 if (studentPathMatch && studentPathMatch[1] === info.dbId) {
  return NextResponse.next()
 }

 // Check teacher path
 if (ucitelPathMatch && ucitelPathMatch[1] === info.dbId) {
  const res = NextResponse.next()
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
  let id = info?.dbId // id has %20 at the end that needs to be removed
  if (!id) {
   request.nextUrl.pathname = '/logout'
   return NextResponse.redirect(request.nextUrl)
  }

  id = id.trim()

  if (isStudent(info)) {
   request.nextUrl.pathname = `/student/${id}`
  } else {
   request.nextUrl.pathname = `/ucitel/${id}`
  }
  return NextResponse.redirect(request.nextUrl)
 }

 const terminPathMatch = pathname.match(/^\/termin\/([^/]+)$/)
 if (terminPathMatch) {
  const terminID = terminPathMatch[1]
  if (!isStudent(info)) {
   request.nextUrl.pathname = `/ucitel/${info.dbId}/termin/${terminID}`
   return NextResponse.redirect(request.nextUrl)
  }
 }
 return NextResponse.next()
}

export const config = {
 matcher: ['/', '/login', '/student/:path*', '/ucitel/:path+', '/termin/:path*'],
}
