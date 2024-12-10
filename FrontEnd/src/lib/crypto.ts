import { SHA3 } from 'sha3'

export function encrypt(req: Request, ticket: string): string | null {
 const hash = new SHA3(512)

 const headers = req.headers
 const ip = headers.get('x-forwarded-for') || ''
 const ua = headers.get('host') || ''

 const hashIp = hash.update(ip).digest('hex')
 hash.reset()
 const hashUa = hash.update(ua).digest('hex')

 const bIp = shaToArr(hashIp)
 const bUa = shaToArr(hashUa)

 try {
  const block: Uint32Array = ticketToArr(ticket)

  const rk: Uint32Array = keygen(bIp, bUa)

  const left = block.slice(0, 4)
  const right = block.slice(4)

  for (let i = 0; i < 32; i++) {
   encRound(left, rk, i)
  }

  for (let i = 0; i < 32; i++) {
   encRound(right, rk, i)
  }

  const encb: Uint32Array = new Uint32Array([...left, ...right])
  return uint32ArrayToHex(encb)
 } catch {
  return null
 }
}

export function decrypt(req: Request, ticket: string): string | null {
 const hash = new SHA3(512)

 const headers = req.headers
 const ip = headers.get('x-forwarded-for') || ''
 const ua = headers.get('host') || ''

 const hashIp = hash.update(ip).digest('hex')
 hash.reset()
 const hashUa = hash.update(ua).digest('hex')

 const bIp = shaToArr(hashIp)
 const bUa = shaToArr(hashUa)

 try {
  const block: Uint32Array = ticketToArr(ticket)
  const rk: Uint32Array = keygen(bIp, bUa)

  const left = block.slice(0, 4)
  const right = block.slice(4)

  for (let i = 31; i >= 0; i--) {
   decRound(left, rk, i)
  }

  for (let i = 31; i >= 0; i--) {
   decRound(right, rk, i)
  }

  const decb: Uint32Array = new Uint32Array([...left, ...right])
  return uint32ArrayToHex(decb)
 } catch {
  return null
 }
}

function uint32ArrayToHex(uint32Array: Uint32Array): string {
 return Array.from(uint32Array)
  .map((num) => num.toString(16).padStart(8, '0')) // Convert to hex, pad to 8 chars
  .join('') // Concatenate into a single string
}

function ticketToArr(hex: string): Uint32Array {
 if (hex.length !== 64) {
  throw new Error('Invalid hex string length. Expected 64 characters for 256-bit input.')
 }

 const uint32Array = new Uint32Array(8) // 256 bits = 8 x 32-bit integers

 for (let i = 0; i < 8; i++) {
  // Each Uint32 is 4 bytes (8 hex characters)
  const hexSegment = hex.slice(i * 8, i * 8 + 8)
  uint32Array[i] = parseInt(hexSegment, 16)
 }

 return uint32Array
}

function shaToArr(hex: string): Uint32Array {
 if (hex.length !== 128) {
  throw new Error('Invalid SHA3-512 hex string length. Expected 128 characters.')
 }

 const uint32Array = new Uint32Array(16)
 const array = new Uint32Array(8)

 for (let i = 0; i < 16; i++) {
  const hexsegment = hex.slice(i * 8, i * 8 + 8)
  uint32Array[i] = parseInt(hexsegment, 16)
 }

 for (let i = 0; i < 16; i += 2) {
  array[i / 2] = uint32Array[i] ^ uint32Array[i + 1]
 }

 return array
}

function keygen(key: Uint32Array, seed: Uint32Array): Uint32Array {
 const size = 8

 // Length validation
 if (key.length !== size || seed.length !== size) {
  throw new Error(`Key and seed must be arrays of length ${size}`)
 }

 const rk = new Uint32Array(192)

 // Copy initial key values
 for (let i = 0; i < size; i++) {
  rk[i] = key[i]
 }

 // Round key generation
 const rkT = new Uint32Array(size)
 for (let i = 0; i < size; i++) {
  rkT[i] = key[i]
 }

 for (let i = 0; i < 32; i++) {
  const s = i % 32
  const t0 = shiftLeft32(seed[i % size], s)
  const t1 = shiftLeft32(t0, 1)
  const t2 = shiftLeft32(t0, 2)
  const t3 = shiftLeft32(t0, 3)
  const t4 = shiftLeft32(t0, 4)
  const t5 = shiftLeft32(t0, 5)

  const j = 6 * i
  rk[j + 0] = rotateLeft32(rkT[(j + 0) % size] + t0, 1)
  rk[j + 1] = rotateLeft32(rkT[(j + 1) % size] + t1, 3)
  rk[j + 2] = rotateLeft32(rkT[(j + 2) % size] + t2, 6)
  rk[j + 3] = rotateLeft32(rkT[(j + 3) % size] + t3, 11)
  rk[j + 4] = rotateLeft32(rkT[(j + 4) % size] + t4, 13)
  rk[j + 5] = rotateLeft32(rkT[(j + 5) % size] + t5, 17)
 }

 return rk
}

function encRound(block: Uint32Array, rk: Uint32Array, i: number): void {
 const rkI = 6 * i

 const b0 = rotateLeft32(wrappedAdd32(block[0] ^ rk[rkI], block[1] ^ rk[rkI + 1]), 9)
 const b1 = rotateRight32(wrappedAdd32(block[1] ^ rk[rkI + 2], block[2] ^ rk[rkI + 3]), 5)
 const b2 = rotateRight32(wrappedAdd32(block[2] ^ rk[rkI + 4], block[3] ^ rk[rkI + 5]), 3)
 const b3 = block[0]

 block[0] = b0
 block[1] = b1
 block[2] = b2
 block[3] = b3
}

function decRound(block: Uint32Array, rk: Uint32Array, i: number): void {
 const rkI = 6 * i

 const b0 = block[3]
 const b1 = wrappedSub32(rotateRight32(block[0], 9), b0 ^ rk[rkI]) ^ rk[rkI + 1]
 const b2 = wrappedSub32(rotateLeft32(block[1], 5), b1 ^ rk[rkI + 2]) ^ rk[rkI + 3]
 const b3 = wrappedSub32(rotateLeft32(block[2], 3), b2 ^ rk[rkI + 4]) ^ rk[rkI + 5]

 block[0] = b0
 block[1] = b1
 block[2] = b2
 block[3] = b3
}

// Helper functions
function wrappedAdd32(a: number, b: number): number {
 return (a + b) >>> 0 // Ensures unsigned 32-bit integer wrapping
}

function wrappedSub32(a: number, b: number): number {
 return (a - b) >>> 0 // Ensures unsigned 32-bit integer wrapping
}

function shiftLeft32(value: number, shift: number): number {
 return (value << shift) >>> 0 // Unsigned shift to keep it as 32-bit
}

function rotateLeft32(value: number, shift: number): number {
 return ((value << shift) | (value >>> (32 - shift))) >>> 0 // Unsigned rotation
}

function rotateRight32(value: number, shift: number): number {
 return ((value >>> shift) | (value << (32 - shift))) >>> 0 // Unsigned 32-bit right rotation
}
