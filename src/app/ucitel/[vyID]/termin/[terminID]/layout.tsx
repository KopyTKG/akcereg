import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <>
   <main className="max-w-4xl mx-auto pt-5">{children}</main>
  </>
 )
}
