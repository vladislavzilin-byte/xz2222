import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as admin from 'firebase-admin'
let app: admin.app.App | null = null
function init(){
  if (app) return app
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if(!base64) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_BASE64')
  const json = Buffer.from(base64, 'base64').toString('utf8')
  const creds = JSON.parse(json)
  app = admin.initializeApp({ credential: admin.credential.cert(creds) })
  return app
}
export default async function handler(req: VercelRequest, res: VercelResponse){
  try{
    if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const { uid, secret } = req.body || {}
    if (!uid || !secret) return res.status(400).json({ error: 'uid and secret required' })
    if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' })
    const app = init()
    await app.auth().setCustomUserClaims(uid, { admin: true })
    return res.status(200).json({ ok: true })
  }catch(e:any){ return res.status(500).json({ error: e.message }) }
}
