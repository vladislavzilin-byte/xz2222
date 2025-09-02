import React from 'react'
import * as LA from './localAuth'
type Ctx={user:LA.User|null,loading:boolean,refresh:()=>void}
export const AuthContext=React.createContext<Ctx>({user:null,loading:false,refresh:()=>{}})
export function AuthProvider({children}:{children:React.ReactNode}){const[user,setUser]=React.useState<LA.User|null>(LA.currentUser());const refresh=()=>setUser(LA.currentUser());React.useEffect(()=>{const on=()=>refresh();window.addEventListener('storage',on);return()=>window.removeEventListener('storage',on)},[]);return <AuthContext.Provider value={{user,loading:false,refresh}}>{children}</AuthContext.Provider>}