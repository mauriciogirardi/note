'use client'

import { LoaderIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/context/auth'

export function LoginButton() {
  const { user, isSignIn, onGoogleSignIn } = useAuth()

  useEffect(() => {
    if (user?.email) {
      redirect('/note')
    }
  }, [user])

  async function handleGoogleSignIn() {
    await onGoogleSignIn()
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      aria-label="Entrar na aplicação com um email do google"
      className="flex w-full items-center justify-center gap-2 border py-1 text-sm outline-none transition-colors hover:border-slate-400 hover:text-slate-400"
    >
      {isSignIn ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <>
          <span className="text-xl font-medium ">G</span>
          Entrar com Google
        </>
      )}
    </button>
  )
}
