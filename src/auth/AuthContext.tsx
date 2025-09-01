
import React from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
type Ctx = { user: User | null, loading: boolean }
export const AuthContext = React.createContext<Ctx>({ user: null, loading: true })
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) }), [])
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
