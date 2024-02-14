import { Metadata } from 'next'

import { Header } from '@/components/header'

import { Notes } from './notes'

export const metadata: Metadata = {
  title: 'Home'
}

export default function Note() {
  return (
    <div className="mx-auto my-12 max-w-6xl space-y-6 px-4">
      <Header />

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Notes />
      </div>
    </div>
  )
}
