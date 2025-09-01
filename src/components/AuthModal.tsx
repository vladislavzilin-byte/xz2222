
import React from 'react'
import { auth, googleProvider, appleProvider, db } from '../auth/firebase'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { usePlacesAutocomplete } from '../auth/usePlacesAutocomplete'

export default function AuthModal({ mode, onClose }:{ mode: 'login' | 'signup', onClose: ()=>void }){
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [name, setName] = React.useState('')
  const [surname, setSurname] = React.useState('')
  const addrRef = React.useRef<HTMLInputElement>(null); usePlacesAutocomplete(addrRef)
  const [phone, setPhone] = React.useState('')
  const [social, setSocial] = React.useState('')

  const close = () => { if(!busy) onClose() }

  const doLogin = async () => {
    try{ setBusy(true); setErr(null); await signInWithEmailAndPassword(auth, email.trim(), pass); onClose() }
    catch(e:any){ setErr(e.message) } finally{ setBusy(false) }
  }
  const doGoogle = async () => { try{ setBusy(true); setErr(null); await signInWithPopup(auth, googleProvider); onClose() } catch(e:any){ setErr(e.message) } finally{ setBusy(false) } }
  const doApple  = async () => { try{ setBusy(true); setErr(null); await signInWithPopup(auth, appleProvider); onClose() } catch(e:any){ setErr(e.message) } finally{ setBusy(false) } }

  const doSignup = async () => {
    try{
      setBusy(true); setErr(null);
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), pass)
      await updateProfile(userCred.user, { displayName: `${name} ${surname}`.trim() })
      await setDoc(doc(db, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        name, surname,
        address: addrRef.current?.value || '',
        phone, social,
        email: userCred.user.email,
        createdAt: serverTimestamp()
      })
      onClose()
    } catch(e:any){ setErr(e.message) } finally{ setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="relative w-[92vw] max-w-[520px] rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">{mode === 'login' ? 'Login' : 'Create account'}</div>
          <button onClick={close} className="text-white/70 hover:text-white">✕</button>
        </div>
        {mode === 'login' ? (
          <div className="space-y-3">
            <input className="h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
            <button onClick={doLogin} disabled={busy} className="h-11 w-full rounded-xl bg-white text-black font-medium hover:opacity-90 disabled:opacity-60">{busy?'Please wait…':'Login'}</button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={doGoogle} disabled={busy} className="h-10 rounded-xl bg-white text-black font-medium hover:opacity-90 disabled:opacity-60">Google</button>
              <button onClick={doApple} disabled={busy} className="h-10 rounded-xl bg-white/90 text-black font-medium hover:opacity-90 disabled:opacity-60">Apple</button>
            </div>
          </div>
        ):(
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input className="h-11 rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
              <input className="h-11 rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Surname" value={surname} onChange={e=>setSurname(e.target.value)} />
            </div>
            <input ref={addrRef} className="h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Address" />
            <input className="h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
            <input className="h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Instagram or Facebook account" value={social} onChange={e=>setSocial(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input className="h-11 rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input className="h-11 rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
            </div>
            <button onClick={doSignup} disabled={busy} className="h-11 w-full rounded-xl bg-white text-black font-medium hover:opacity-90 disabled:opacity-60">{busy?'Please wait…':'Sign up'}</button>
            <div className="text-xs text-white/60">Address autocomplete включится, если задан <code>VITE_GOOGLE_MAPS_API_KEY</code>.</div>
          </div>
        )}
        {err && <div className="mt-3 text-sm text-red-300">{err}</div>}
      </div>
    </div>
  )
}
