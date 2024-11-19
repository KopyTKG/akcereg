import { tLink } from '@/lib/types'
import { House, LayoutGrid, Menu, Users } from 'lucide-react'
import NavbarComponent from './navbarComponent'
import { getUserInfo } from '@/lib/stag'
import { Get } from '@/app/actions'

export function NavbarStudent({ id }: { id: string }) {
 const baseUrl = '/student/#id'
 const url = baseUrl.replace('#id', id)
 const links: tLink[] = [
  {
   label: 'Domů',
   href: `${url}`,
   icon: <House className="w-5" />,
  },
  {
   label: 'Moje termíny',
   href: `${url}/moje`,
   icon: <Menu className="w-5" />,
  },
 ]
 return <NavbarComponent id={id} links={links} url={url} st={false} />
}

export async function NavbarTeacher({ id }: { id: string }) {
 const ticket = (await Get('x-svt'))?.value || ''
 const info = await getUserInfo(ticket)
 if (!info) return null

 const baseUrl = '/ucitel/#id'
 const url = baseUrl.replace('#id', id)
 const links: tLink[] = [
  {
   label: 'Domů',
   href: `${url}`,
   icon: <House className="w-5" />,
  },
  {
   label: 'Procházet',
   href: `${url}/terminy`,
   icon: <Menu className="w-5" />,
  },
  {
   label: 'Studenti',
   href: `${url}/hledat`,
   icon: <Users className="w-5" />,
  },
  {
   label: 'Předměty',
   href: `${url}/predmety`,
   icon: <LayoutGrid className="w-5" />,
  },
 ]

 return <NavbarComponent id={id} links={links} url={url} st={true} />
}
