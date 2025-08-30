import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
export default function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }){
  const { user, loading, isAdmin } = React.useContext(AuthContext)
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white/60">Loading…</div>
  if (!user) return <Navigate to="/auth" replace />
  if (requireAdmin && !isAdmin) return <div className="min-h-screen flex items-center justify-center text-white/70">Access denied</div>
  return <>{children}</>
}
