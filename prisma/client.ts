/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client'

declare global {
 namespace NodeJS {
  interface Global {}
 }
}

// eslint-disable-next-line no-undef
interface CustomeNodeJsGlobal extends NodeJS.Global {
 prisma: PrismaClient
}

declare const global: CustomeNodeJsGlobal

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
