import React from 'react'
import { AuthContext } from '../auth/AuthContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import { usePlacesAutocomplete } from '../auth/usePlacesAutocomplete'

export default function Profile(){
  const { user, userDoc } = React.useContext(AuthContext)
  const [state, setState] = React.useState({
    name: userDoc?.name || '',
    surname: userDoc?.surname || '',
    address: userDoc?.address || '',
    phone: userDoc?.phone || '',
    social: userDoc?.social || ''
  })
  const [saving, setSaving] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)
  const addrRef = React.useRef<HTMLInputElement>(null)
  usePlacesAutocomplete(addrRef)

  React.useEffect(()=>{
    setState({
      name: userDoc?.name || '',
      surname: userDoc?.surname || '',
      address: userDoc?.address || '',
      phone: userDoc?.phone || '',
      social: userDoc?.social || ''
    })
    if (addrRef.current) addrRef.current.value = userDoc?.address || ''
  }, [userDoc])

  if (!user) return <div className='min-h-screen grid place-items-center text-white/70'>Please log in</div>

  const save = async () => {
    try{
      setSaving(true); setMsg(null);
      await updateDoc(doc(db, 'users', user.uid), { ...state, address: addrRef.current?.value || '' })
      setMsg('Saved')
    }catch(e:any){ setMsg(e.message || 'Error') } finally { setSaving(false) }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='w-[92vw] max-w-[720px] rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl p-6 text-white'>
        <h1 className='text-2xl font-semibold mb-4'>My profile</h1>
        <div className='grid sm:grid-cols-2 gap-3'>
          <div><div className='text-xs text-white/60 mb-1'>Name</div><input value={state.name} onChange={e=>setState({...state,name:e.target.value})} className='h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40'/></div>
          <div><div className='text-xs text-white/60 mb-1'>Surname</div><input value={state.surname} onChange={e=>setState({...state,surname:e.target.value})} className='h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40'/></div>
          <div className='sm:col-span-2'><div className='text-xs text-white/60 mb-1'>Address</div><input ref={addrRef} defaultValue={state.address} className='h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40'/></div>
          <div><div className='text-xs text-white/60 mb-1'>Phone</div><input value={state.phone} onChange={e=>setState({...state,phone:e.target.value})} className='h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40'/></div>
          <div><div className='text-xs text-white/60 mb-1'>Instagram / Facebook</div><input value={state.social} onChange={e=>setState({...state,social:e.target.value})} className='h-11 w-full rounded-xl bg-white/10 border border-white/20 px-3 outline-none focus:border-white/40'/></div>
        </div>
        <div className='mt-4 flex items-center gap-3'>
          <button onClick={save} disabled={saving} className='h-11 px-4 rounded-xl bg-white text-black font-medium hover:opacity-90 disabled:opacity-60'>{saving?'Saving…':'Save'}</button>
          {msg && <div className='text-sm text-white/70'>{msg}</div>}
        </div>
      </div>
    </div>
  )
}
