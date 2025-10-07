import { validateTicket } from '@/lib/auth'
import { Forbidden, Success, Unauthorized } from '@/lib/http'
import { getUserInfo } from '@/lib/stag'
import { tGetStagUserListForLoginTicketV2 } from '@/types/stag_response_types'

export async function GET(req: Request) {
 const rTicket = validateTicket(req)
 if (!rTicket) return Unauthorized()

 const data = (await getUserInfo(rTicket)) as tGetStagUserListForLoginTicketV2 | null

 if (!data) {
  return Forbidden()
 } else return Success(data)
}
