import React from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
type Ctx = { user: User | null, loading: boolean, isAdmin: boolean }
export const AuthContext = React.createContext<Ctx>({ user: null, loading: true, isAdmin: false })
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setIsAdmin(false)
      setLoading(false)
    })
    return () => unsub()
  }, [])
  return <AuthContext.Provider value={{ user, loading, isAdmin }}>{children}</AuthContext.Provider>
}
