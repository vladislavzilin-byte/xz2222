import React, { useContext, useState } from 'react'
import { AuthContext } from '../auth/AuthContext'
export default function AdminPage(){
  const { isAdmin } = useContext(AuthContext)
  const [uid, setUid] = useState('')
  const [secret, setSecret] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const setAdmin = async () => {
    setMsg(null)
    try{
      const res = await fetch('/api/set-admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({uid,secret})})
      const data = await res.json()
      if(!res.ok) throw new Error(data.error || 'Failed')
      setMsg('Admin role set successfully.')
    }catch(e:any){ setMsg(e.message) }
  }
  if(!isAdmin){ return <div className="min-h-screen flex items-center justify-center text-white/70">Access denied (admin only)</div> }
  return (<div className="min-h-screen flex items-center justify-center bg-black px-4">
    <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>
      <p className="text-white/70 mb-4 text-sm">Set "admin" custom claim for a user UID.</p>
      <input value={uid} onChange={e=>setUid(e.target.value)} placeholder="User UID" className="h-11 w-full rounded-xl bg-white/10 border border-white/20 px-4 mb-3"/>
      <input value={secret} onChange={e=>setSecret(e.target.value)} placeholder="Admin Secret" className="h-11 w-full rounded-xl bg-white/10 border border-white/20 px-4 mb-4"/>
      <button onClick={setAdmin} className="h-12 rounded-xl bg-white text-black font-medium hover:opacity-90">Set Admin</button>
      {msg && <p className="mt-3 text-sm text-white/70">{msg}</p>}
    </div>
  </div>)
}
