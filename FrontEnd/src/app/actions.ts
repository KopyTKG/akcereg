'use server'
import { cookies } from 'next/headers'

export async function getParam(param: string) {
 if ((await cookies()).has(param)) {
  return (await cookies()).get(param)
 } else {
  return null
 }
}

export async function deleteParam(param: string) {
 if ((await cookies()).has(param)) {
  return (await cookies()).delete(param)
 } else {
  return null
 }
}

export async function Get(key: string) {
 return (await cookies()).get(key)
}
