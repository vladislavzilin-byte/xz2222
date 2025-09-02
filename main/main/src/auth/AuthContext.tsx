import React from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export type UserDoc = { uid: string; name?: string; surname?: string; address?: string; phone?: string; social?: string; email?: string; role?: 'user' | 'admin' }
type Ctx = { user: User | null; loading: boolean; userDoc: UserDoc | null; isAdmin: boolean }
export const AuthContext = React.createContext<Ctx>({ user: null, loading: true, userDoc: null, isAdmin: false })
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [userDoc, setUserDoc] = React.useState<UserDoc | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid))
          if (snap.exists()) { const data = snap.data() as any; setUserDoc({ uid: u.uid, ...data }); setIsAdmin((data?.role || '')==='admin') }
          else { setUserDoc({ uid: u.uid, email: u.email || '' }); setIsAdmin(false) }
        } catch { setUserDoc({ uid: u.uid, email: u.email || '' }); setIsAdmin(false) }
      } else { setUserDoc(null); setIsAdmin(false) }
      setLoading(false)
    })
    return () => unsub()
  }, [])
  return <AuthContext.Provider value={{ user, loading, userDoc, isAdmin }}>{children}</AuthContext.Provider>
}