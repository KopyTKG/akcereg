import { redirect } from 'next/navigation'

export default async function LoginPage({
 searchParams,
}: {
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
 const stagServer = process.env.STAG_SERVER
 const baseUrl = process.env.NEXT_PUBLIC_AUTH

 if (!stagServer || !baseUrl) {
  throw new Error('Missing environment variables')
 }

 // Correctly access searchParams
 const { s } = await searchParams

 // Check if 's' parameter is 'true'
 if (s === 'true') {
  // If 's' is 'true', redirect to home page
  redirect('/?s=true')
 }

 // If 's' is not 'true' or doesn't exist, proceed with the original redirection
 const redirectUrl = `${stagServer}/login?originalURL=${baseUrl}/login`
 redirect(redirectUrl)
}
