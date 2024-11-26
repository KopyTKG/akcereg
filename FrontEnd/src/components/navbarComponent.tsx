'use client'
import { tLink } from '@/lib/types'
import { Moon, Sun, User } from 'lucide-react'
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useLayoutEffect } from 'react'

export default function NavbarComponent({
 id,
 links,
 url,
 st,
}: {
 id: string
 links: tLink[]
 url: string
 st: boolean
}) {
 const router = useRouter()
 const { theme, setTheme } = useTheme()

 useLayoutEffect(() => {
  const themeItem = localStorage.getItem('theme')
  if (!themeItem) localStorage.setItem('theme', theme || 'light')
 }, [theme])

 return (
  <nav className="w-dvw flex justify-center py-3 border border-transparent border-b-zinc-500/50 shadow-md dark:shadow-zinc-900 fixed top-0 backdrop-blur-md">
   <section className="w-full flex max-w-6xl px-3 md:px-6 ">
    <main className="hidden md:flex flex-row gap-4">
     {links.map((item: tLink) => {
      return (
       <Button key={item.href} onClick={() => router.push(item.href)} variant="ghost">
        {item.icon} &nbsp; {item.label}
       </Button>
      )
     })}
    </main>
    <div className="flex w-full md:justify-end gap-5">
     <DropdownMenu>
      <DropdownMenuTrigger>
       <div className="w-10 h-10 rounded-full bg-stone-400 dark:bg-stone-600 flex items-center justify-center">
        <User className="text-white w-10" />
       </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
       <DropdownMenuLabel className="block md:hidden"> Navigace </DropdownMenuLabel>
       <div className="block md:hidden">
        {links.map((item: tLink) => {
         return (
          <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
           {item.icon} &nbsp; {item.label}
          </DropdownMenuItem>
         )
        })}
       </div>
       <DropdownMenuLabel>Nastavení</DropdownMenuLabel>

       <DropdownMenuSeparator />
       {!st && (
        <>
         <DropdownMenuItem
          onClick={() => {
           router.push(`/student/${id}/profil`)
          }}
         >
          Profil
         </DropdownMenuItem>
        </>
       )}
       <DropdownMenuItem
        disabled={st}
        onClick={() => {
         router.push(`${url}/navod`)
        }}
       >
        Návod
       </DropdownMenuItem>

       <DropdownMenuItem
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex gap-2"
       >
        {theme === 'dark' ? (
         <Sun className="w-5 text-white fill-white" />
        ) : (
         <Moon className="w-5 text-black fill-black" />
        )}
        Vzhled
       </DropdownMenuItem>
       <DropdownMenuSeparator />
       <DropdownMenuItem
        onClick={() => {
         router.push(`/logout`)
        }}
        className="text-red-600 dark:text-red-400"
       >
        Odhlásit se
       </DropdownMenuItem>
      </DropdownMenuContent>
     </DropdownMenu>
    </div>
   </section>
  </nav>
 )
}
