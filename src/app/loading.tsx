import { Loader2 } from 'lucide-react'

export default function LoadingRoot() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="mb-4 animate-spin text-slate-300" />
      <h1 className="text-white">Carregando...</h1>
    </div>
  )
}
