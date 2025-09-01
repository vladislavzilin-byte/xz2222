
import React from 'react'
import AuthModal from './AuthModal'
export default function AuthBar(){
  const [open, setOpen] = React.useState<null | 'login' | 'signup'>(null)
  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2 bg-white/10 border border-white/15 backdrop-blur-xl rounded-2xl p-2">
      <button onClick={()=>setOpen('login')} className="px-3 py-1.5 rounded-lg text-sm bg-white/15 hover:bg-white/25 text-white">Login</button>
      <button onClick={()=>setOpen('signup')} className="px-3 py-1.5 rounded-lg text-sm bg-white/15 hover:bg-white/25 text-white">Sign up</button>
      {open && <AuthModal mode={open} onClose={()=>setOpen(null)} />}
    </div>
  )
}
