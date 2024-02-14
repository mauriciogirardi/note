'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Paintbrush } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Profile } from './profile'

const schemaSearch = z.object({
  search: z.string()
})

type SchemaSearch = z.infer<typeof schemaSearch>

export function Header() {
  const searchParams = useSearchParams()
  const search = searchParams.get('q')
  const router = useRouter()
  const { register, handleSubmit, reset, watch } = useForm<SchemaSearch>({
    resolver: zodResolver(schemaSearch),
    defaultValues: {
      search: search ?? ''
    }
  })

  function handleSearch({ search }: SchemaSearch) {
    router.push(`/note?q=${search}`)
  }

  function handleClearFilters() {
    reset({ search: '' })
    router.push('/note')
  }

  useEffect(() => {
    const content = watch((value) => {
      if (value.search === '') router.push('/note')
    })
    return () => content.unsubscribe()
  }, [watch, router])

  return (
    <div className="space-y-14">
      <div className="flex items-center justify-between">
        <Image src="/logo.svg" alt="Nlw Expert" width={140} height={50} />
        <Profile />
      </div>
      <form
        className="flex w-full items-center justify-between"
        onSubmit={handleSubmit(handleSearch)}
      >
        <input
          autoComplete="off"
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          {...register('search')}
        />

        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-md py-2 font-semibold text-slate-400 outline-none hover:text-slate-500 focus-visible:text-lime-400"
        >
          <Paintbrush />
        </button>
      </form>
    </div>
  )
}
