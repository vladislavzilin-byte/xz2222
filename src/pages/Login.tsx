import React from 'react'
import GlassButton from '../components/GlassButton'

export default function Login() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form className="space-y-4">
          <div className="text-left">
            <label className="block text-sm mb-1 text-white/70">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-white/20"
              placeholder="you@example.com"
            />
          </div>
          <div className="text-left">
            <label className="block text-sm mb-1 text-white/70">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-white/20"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 select-none">
              <input type="checkbox" className="accent-white/70" />
              <span className="text-white/70">Remember me</span>
            </label>
            <a className="text-white/70 hover:text-white" href="#">Forgot password?</a>
          </div>
          <div className="pt-2 flex justify-center">
            <GlassButton type="submit">Sign in</GlassButton>
          </div>
        </form>
      </div>
    </div>
  )
}
