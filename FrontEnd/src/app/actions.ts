'use server'
import { cookies } from 'next/headers'

export async function setStag(params: any) {
 const oneDay: number = Date.now() + 60 * 60 * 1000 * 1.15
 const setter = await cookies()
 if (setter) {
  setter.set('stagUserTicket', params.stagUserTicket, { expires: oneDay })
  setter.set('stagUserInfo', params.stagUserInfo, { expires: oneDay })
 }
 return params
}

export async function Set(key: string, value: string) {
 const oneDay: number = Date.now() + 60 * 60 * 1000 * 1.15
 const setter = await cookies()
 if (setter) {
  setter.set(key, value, { expires: oneDay })
 }
}

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
