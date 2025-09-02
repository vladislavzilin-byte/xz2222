import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import GlassButton from './components/GlassButton'
import AuthBar from './components/AuthBar'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
function Home(){return <div className='relative min-h-screen bg-black bg-stars'><div className='relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6'><img src='/iz-logo.svg' className='w-44 md:w-56 mb-4 opacity-90' alt='logo'/><p className='max-w-2xl text-white/70 mb-8'>Demo without API keys: local accounts stored in browser only.</p><div className='grid grid-cols-1 sm:grid-cols-2 gap-4'><GlassButton label='Portfolio' to='/'/><GlassButton label='Shop' to='/' delay={0.05}/><GlassButton label='Training' to='/' delay={0.1}/><GlassButton label='Contacts' to='/' delay={0.15}/></div><div className='mt-10 text-sm text-white/60'>izhairtrend.shop · support@izhairtrend.shop</div></div></div>}
export default function App(){const location=useLocation();return <><AuthBar/><AnimatePresence mode='wait'><Routes location={location} key={location.pathname}><Route path='/' element={<Home/>}/><Route path='/profile' element={<Page><Profile/></Page>}/><Route path='/admin' element={<Page><Admin/></Page>}/></Routes></AnimatePresence></>}
function Page({children}:{children:React.ReactNode}){return <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={{duration:.45}}><header className='fixed top-3 left-4 z-40'><Link to='/' className='px-3 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xl text-white/80 hover:text-white'>← Home</Link></header>{children}</motion.div>}