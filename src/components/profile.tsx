'use client'
import { LoaderIcon, LogOut } from 'lucide-react'
import Image from 'next/image'

import { useAuth } from '@/context/auth'

export function Profile() {
  const { user, onLogout, isSignOut } = useAuth()

  async function handleLogout() {
    await onLogout()
  }

  return (
    <div className="p-4">
      {user && (
        <div className="flex items-center gap-4">
          <div>
            <p className="text-right font-medium">{user?.displayName}</p>
            <p className="text-xs text-slate-300">{user?.email}</p>
          </div>
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || ''}
              width={50}
              height={50}
              className="rounded-full"
            />
          )}

          <div className="h-11 w-px bg-slate-600" />

          {isSignOut ? (
            <LoaderIcon className="animate-spin text-slate-300" />
          ) : (
            <LogOut
              onClick={handleLogout}
              tabIndex={1}
              role="button"
              aria-label="Fazer logout da aplicação"
              className="cursor-pointer text-slate-200 outline-none hover:text-slate-400 focus-visible:text-lime-400"
            />
          )}
        </div>
      )}
    </div>
  )
}
