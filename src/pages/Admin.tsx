import React from 'react'
import { AuthContext } from '../auth/AuthContext'
import { collection, getDocs, orderBy, query, limit, updateDoc, doc } from 'firebase/firestore'
import { db } from '../auth/firebase'

type Row = { uid: string; name?: string; surname?: string; email?: string; role?: 'user' | 'admin' }

export default function Admin(){
  const { isAdmin } = React.useContext(AuthContext)
  const [rows, setRows] = React.useState<Row[]>([])
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState<string | null>(null)

  React.useEffect(()=>{
    const run = async () => {
      try{
        setLoading(true)
        const q = query(collection(db, 'users'), orderBy('createdAt','desc'), limit(100))
        const snap = await getDocs(q)
        const data: Row[] = []
        snap.forEach(d => data.push({ uid: d.id, ...(d.data() as any) }))
        setRows(data)
      } catch(e:any){ setErr(e.message) } finally { setLoading(false) }
    }
    run()
  }, [])

  const setRole = async (uid: string, role: 'user'|'admin') => {
    try{
      await updateDoc(doc(db,'users',uid), { role })
      setRows(r => r.map(x => x.uid===uid ? { ...x, role } : x))
    } catch(e:any){ alert(e.message) }
  }

  if (!isAdmin) return <div className='min-h-screen grid place-items-center text-white/70'>Admins only</div>

  return (
    <div className='min-h-screen p-6 text-white'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-2xl font-semibold mb-4'>Admin — Users</h1>
        {loading ? <div>Loading…</div> : err ? <div className='text-red-300'>{err}</div> : (
          <div className='rounded-2xl border border-white/10 bg-white/5 overflow-hidden'>
            <table className='w-full text-sm'>
              <thead className='bg-white/10'>
                <tr>
                  <th className='text-left p-3'>Name</th>
                  <th className='text-left p-3'>Email</th>
                  <th className='text-left p-3'>Role</th>
                  <th className='text-left p-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.uid} className='border-t border-white/10'>
                    <td className='p-3'>{(r.name||'') + ' ' + (r.surname||'')}</td>
                    <td className='p-3'>{r.email}</td>
                    <td className='p-3'>{r.role || 'user'}</td>
                    <td className='p-3'>
                      <div className='flex gap-2'>
                        <button onClick={()=>setRole(r.uid,'user')} className='px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25'>User</button>
                        <button onClick={()=>setRole(r.uid,'admin')} className='px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25'>Admin</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
