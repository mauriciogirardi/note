import { Metadata } from 'next'

import { Header } from '@/components/header'

import { Notes } from './notes'

export const metadata: Metadata = {
  title: 'Home'
}

export default function Note() {
  return (
    <div className="mx-auto my-6 max-w-full space-y-4 px-6 md:my-12 md:max-w-6xl md:space-y-6 md:px-4">
      <Header />

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[200px] grid-cols-1 gap-6 md:auto-rows-[250px] md:grid-cols-2 lg:grid-cols-3">
        <Notes />
      </div>
    </div>
  )
}
