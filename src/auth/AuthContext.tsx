import React from 'react'
import { User, onAuthStateChanged, getIdTokenResult } from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
type Ctx = { user: User | null, loading: boolean, isAdmin: boolean, profile: any | null }
export const AuthContext = React.createContext<Ctx>({ user: null, loading: true, isAdmin: false, profile: null })
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [profile, setProfile] = React.useState<any | null>(null)
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const token = await getIdTokenResult(u)
        setIsAdmin(!!token.claims.admin)
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, { uid: u.uid, email: u.email || null, displayName: u.displayName || null, provider: u.providerData?.[0]?.providerId || 'unknown', createdAt: serverTimestamp() }, { merge: true })
          setProfile((await getDoc(ref)).data())
        } else setProfile(snap.data())
      } else { setIsAdmin(false); setProfile(null) }
      setLoading(false)
    })
    return () => unsub()
  }, [])
  return <AuthContext.Provider value={{ user, loading, isAdmin, profile }}>{children}</AuthContext.Provider>
}
