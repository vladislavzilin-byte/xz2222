import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../auth/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import AuthButtons from '../components/AuthButtons'
import AddressInput from '../components/AddressInput'
const schema = z.object({ mode: z.enum(['signup','login']).default('signup'), email: z.string().email(), password: z.string().min(6), name: z.string().min(1), surname: z.string().min(1), social: z.string().optional(), address: z.any().nullable() })
type FormVals = z.infer<typeof schema>
export default function AuthPage(){
  const { register, handleSubmit, setValue, watch, formState:{errors} } = useForm<FormVals>({ resolver: zodResolver(schema), defaultValues:{ mode:'signup' } })
  const [busy,setBusy]=React.useState(false); const [msg,setMsg]=React.useState<string|null>(null)
  const address = watch('address')
  const onSubmit = async (vals: FormVals) => {
    setMsg(null); setBusy(true)
    try{
      if(vals.mode==='signup'){
        const cred = await createUserWithEmailAndPassword(auth, vals.email, vals.password)
        await updateProfile(cred.user, { displayName: `${vals.name} ${vals.surname}` })
        await setDoc(doc(db,'users',cred.user.uid), { uid: cred.user.uid, email: vals.email, displayName: `${vals.name} ${vals.surname}`, name: vals.name, surname: vals.surname, social: vals.social || null, address: address ? { ...address, verified: true } : null, provider: 'password', createdAt: serverTimestamp() }, { merge: true })
        setMsg('Account created. You are signed in.')
      } else {
        await signInWithEmailAndPassword(auth, vals.email, vals.password); setMsg('Logged in.')
      }
    } catch(e:any){ setMsg(e.message) } finally { setBusy(false) }
  }
  return (<div className="min-h-screen flex items-center justify-center bg-black px-4">
    <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 md:p-10">
      <h1 className="text-2xl font-semibold mb-1">Join / Sign in</h1>
      <p className="text-white/60 mb-6">Use Google / Apple or simple email sign-up with verified address.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div><h2 className="font-medium mb-3">OAuth</h2><AuthButtons/><p className="text-xs text-white/50 mt-2">Apple/Google via Firebase.</p></div>
        <div><h2 className="font-medium mb-3">Email (simple registration)</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex items-center gap-4 text-sm">
              <label className="inline-flex items-center gap-2"><input type="radio" value="signup" {...register('mode')} defaultChecked /><span>Sign up</span></label>
              <label className="inline-flex items-center gap-2"><input type="radio" value="login" {...register('mode')} /><span>Login</span></label>
            </div>
            <input placeholder="Email" className="h-11 rounded-xl bg-white/10 border border-white/20 px-4" {...register('email')} /> {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            <input placeholder="Password (min 6)" type="password" className="h-11 rounded-xl bg-white/10 border border-white/20 px-4" {...register('password')} /> {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Name" className="h-11 rounded-xl bg-white/10 border border-white/20 px-4" {...register('name')} />
              <input placeholder="Surname" className="h-11 rounded-xl bg-white/10 border border-white/20 px-4" {...register('surname')} />
            </div>
            <input placeholder="Instagram or Facebook @handle" className="h-11 rounded-xl bg-white/10 border border-white/20 px-4" {...register('social')} />
            <AddressInput value={address || null} onChange={(p) => setValue('address', p as any)} />
            <button disabled={busy} className="h-12 rounded-xl bg-white text-black font-medium hover:opacity-90 disabled:opacity-60">{busy?'Please wait…':'Submit'}</button>
          </form>
          {msg && <p className="text-sm mt-3 text-white/70">{msg}</p>}
        </div>
      </div>
    </div>
  </div>)
}
