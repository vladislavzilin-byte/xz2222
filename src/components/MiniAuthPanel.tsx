import React from 'react'
import { auth, googleProvider, appleProvider } from '../auth/firebase'
import { signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { AuthContext } from '../auth/AuthContext'

export default function MiniAuthPanel() {
  const { user, isAdmin } = React.useContext(AuthContext)
  const [open, setOpen] = React.useState(true)
  const [email, setEmail] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  const doGoogle = async () => { try{ setBusy(true); setErr(null); await signInWithPopup(auth, googleProvider) }catch(e:any){ setErr(e.message) }finally{ setBusy(false) } }
  const doApple  = async () => { try{ setBusy(true); setErr(null); await signInWithPopup(auth, appleProvider) }catch(e:any){ setErr(e.message) }finally{ setBusy(false) } }
  const doEmail  = async () => { try{ setBusy(true); setErr(null); await signInWithEmailAndPassword(auth, email.trim(), pass) }catch(e:any){ setErr(e.message) }finally{ setBusy(false) } }

  return (
    <div className="relative z-50">
      <div className="flex items-center gap-2 justify-end">
        <button onClick={()=>setOpen(o=>!o)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-sm hover:bg-white/15">{open ? 'Close' : (user ? 'Account' : 'Login')}</button>
      </div>
      {open && (
        <div className="mt-2 w-[280px] sm:w-[300px] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 shadow-2xl">
          {!user ? (
            <div className="space-y-3">
              <div className="text-sm font-medium text-white/90">Sign in</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={doGoogle} disabled={busy} className="h-10 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 disabled:opacity-60">Google</button>
                <button onClick={doApple} disabled={busy} className="h-10 rounded-lg bg-white/90 text-black text-sm font-medium hover:opacity-90 disabled:opacity-60">Apple</button>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="space-y-2">
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="h-10 w-full rounded-lg bg-white/10 border border-white/20 px-3 text-sm outline-none focus:border-white/40" />
                <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="h-10 w-full rounded-lg bg-white/10 border border-white/20 px-3 text-sm outline-none focus:border-white/40" />
                <button onClick={doEmail} disabled={busy} className="h-10 w-full rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 disabled:opacity-60">{busy ? 'Please wait…' : 'Login'}</button>
                <div className="text-xs text-white/60">Need an account? <a href="/auth" className="underline">Create here</a></div>
              </div>
              {err && <div className="text-xs text-red-400">{err}</div>}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-white/70">Signed in as</div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="font-medium">{user.displayName || 'User'}</div>
                <div className="text-xs text-white/60">{user.email}</div>
              </div>
              <div className="flex items-center justify-between gap-2">
                {isAdmin ? (<a href="/admin" className="px-3 h-9 rounded-lg bg-white/10 border border-white/20 text-sm flex items-center hover:bg-white/15">Admin</a>) : <span className="text-xs text-white/50">No admin access</span>}
                <button onClick={()=>signOut(auth)} className="h-9 px-3 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90">Logout</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
