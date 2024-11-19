'use server'
import { cookies } from 'next/headers'

export async function Get(key: string) {
 return (await cookies()).get(key)
}
