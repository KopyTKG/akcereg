import { tTermin } from '@/types/next_response_types'

export type tTypUzivatele = 'student' | 'teacher' | 'admin' | null

export type tNodeProps = {
 demo: boolean | null
 props: tTermin
 typUzivatele: tTypUzivatele
}
