import { Metadata } from 'next'

import { LoginButton } from './login-button'

export const metadata: Metadata = {
  title: 'Home'
}

export default function Home() {
  return (
    <div className="m-auto flex h-screen w-full flex-col items-center justify-center gap-10 px-4 md:max-w-[400px]">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold">Acesse sua conta</h1>
        <span className="text-pretty text-center text-xs text-slate-400">
          Para utilizar esta aplicação, você precisa ter uma conta do Gmail para
          autenticação.
        </span>
      </div>
      <LoginButton />
    </div>
  )
}
