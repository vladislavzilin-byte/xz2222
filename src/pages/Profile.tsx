import React from 'react'
import { AuthContext } from '../store/AuthContext'
import * as LA from '../store/localAuth'
export default function Profile(){
  const { user, refresh } = React.useContext(AuthContext)
  const [state,setState]=React.useState({name:user?.name||'',surname:user?.surname||'',address:user?.address||'',phone:user?.phone||'',social:user?.social||''})
  const [email,setEmail]=React.useState(user?.email||''); const [password,setPassword]=React.useState('')
  const [msg,setMsg]=React.useState<string|null>(null); const [busy,setBusy]=React.useState(false)
  const [avatar,setAvatar]=React.useState<string>(user?.avatar||'')
  if(!user) return <div className='min-h-screen grid place-items-center text-white/70'>Please log in</div>
  const saveProfile=async()=>{try{setBusy(true);setMsg(null);LA.updateUser(user.uid,{...state,avatar});refresh();setMsg('Saved')}catch(e:any){setMsg(e.message)}finally{setBusy(false)}}
  const saveAuth=async()=>{try{setBusy(true);setMsg(null);if(password&&password.length<6)throw new Error('Password must be at least 6 characters');LA.changeEmailPassword(user.uid,{email,password:password||undefined});refresh();setPassword('');setMsg('Email/Password updated')}catch(e:any){setMsg(e.message)}finally{setBusy(false)}}
  const onAvatar=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const fr=new FileReader();fr.onload=()=>setAvatar(fr.result as string);fr.readAsDataURL(f)}
  return <div className='min-h-screen flex items-center justify-center p-6'>
    <div className='w-[92vw] max-w-[760px] card p-6 text-white'>
      <h1 className='text-2xl font-semibold mb-4'>My profile</h1>
      <div className='flex gap-6 mb-4 items-start'>
        <div><div className='w-24 h-24 rounded-2xl bg-white/10 border border-white/20 overflow-hidden mb-2'>{avatar?<img src={avatar} className='w-full h-full object-cover'/>:<div className='w-full h-full grid place-items-center text-white/40'>No photo</div>}</div><input type='file' accept='image/*' onChange={onAvatar} className='text-xs'/></div>
        <div className='grid sm:grid-cols-2 gap-3 flex-1'>
          <div><div className='text-xs text-white/60 mb-1'>Name</div><input value={state.name} onChange={e=>setState({...state,name:e.target.value})} className='input'/></div>
          <div><div className='text-xs text-white/60 mb-1'>Surname</div><input value={state.surname} onChange={e=>setState({...state,surname:e.target.value})} className='input'/></div>
          <div className='sm:col-span-2'><div className='text-xs text-white/60 mb-1'>Address</div><input value={state.address} onChange={e=>setState({...state,address:e.target.value})} className='input'/></div>
          <div><div className='text-xs text-white/60 mb-1'>Phone</div><input value={state.phone} onChange={e=>setState({...state,phone:e.target.value})} className='input'/></div>
          <div><div className='text-xs text-white/60 mb-1'>Instagram / Facebook</div><input value={state.social} onChange={e=>setState({...state,social:e.target.value})} className='input'/></div>
        </div>
      </div>
      <div className='flex gap-3'><button onClick={saveProfile} disabled={busy} className='btn px-4'>{busy?'Saving…':'Save profile'}</button></div>
      <div className='h-px bg-white/10 my-5'/>
      <div className='grid sm:grid-cols-2 gap-3'><div><div className='text-xs text-white/60 mb-1'>Email</div><input value={email} onChange={e=>setEmail(e.target.value)} className='input'/></div><div><div className='text-xs text-white/60 mb-1'>New password</div><input value={password} onChange={e=>setPassword(e.target.value)} type='password' className='input'/></div></div>
      <div className='mt-3 flex gap-3'><button onClick={saveAuth} disabled={busy} className='btn px-4'>{busy?'Saving…':'Update email/password'}</button></div>
      {msg&&<div className='mt-3 text-sm text-white/70'>{msg}</div>}
    </div>
  </div>
}