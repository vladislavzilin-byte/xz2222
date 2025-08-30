import React from 'react'
import { auth, googleProvider, appleProvider, db } from '../auth/firebase'
import { signInWithPopup } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
export default function AuthButtons() {
  const [err, setErr] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)
  const saveProfile = async (u: any) => {
    const ref = doc(db, 'users', u.uid)
    await setDoc(ref, { uid: u.uid, email: u.email || null, displayName: u.displayName || null, provider: u.providerData?.[0]?.providerId || 'unknown', photoURL: u.photoURL || null, lastLoginAt: serverTimestamp() }, { merge: true })
  }
  const signGoogle = async () => { try{ setBusy(true); setErr(null); const cred = await signInWithPopup(auth, googleProvider); await saveProfile(cred.user) } catch(e:any){ setErr(e.message) } finally { setBusy(false) } }
  const signApple = async () => { try{ setBusy(true); setErr(null); const cred = await signInWithPopup(auth, appleProvider); await saveProfile(cred.user) } catch(e:any){ setErr(e.message) } finally { setBusy(false) } }
  return (<div className="flex flex-col gap-3">
    <button onClick={signGoogle} disabled={busy} className="h-12 rounded-xl bg-white text-black font-medium hover:opacity-90 disabled:opacity-60">Sign in with Google</button>
    <button onClick={signApple} disabled={busy} className="h-12 rounded-xl bg-white/90 text-black font-medium hover:opacity-90 disabled:opacity-60">Sign in with Apple</button>
    {err && <p className="text-red-400 text-sm">{err}</p>}
  </div>)
}
