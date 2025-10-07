'use client'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

import { tGetStagUserListForLoginTicketV2 } from '@/types/stag_response_types'

type UserContextType = {
 userInfo: tGetStagUserListForLoginTicketV2
 setUserInfo: Dispatch<SetStateAction<tGetStagUserListForLoginTicketV2>>
}

const UserCtx = createContext<UserContextType | undefined>(undefined)

export const useUserContext = (): UserContextType => {
 const context = React.useContext(UserCtx)
 if (!context) {
  throw new Error('useUserContext must be used within a UserProvider')
 }
 return context
}

export default function UserProvider({
 children,
 data,
}: {
 children: React.ReactNode
 data: tGetStagUserListForLoginTicketV2
}) {
 const [userInfo, setUserInfo] = useState<tGetStagUserListForLoginTicketV2>(data)
 return <UserCtx.Provider value={{ userInfo, setUserInfo }}>{children}</UserCtx.Provider>
}
