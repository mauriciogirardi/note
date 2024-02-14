'use client'

import { redirect, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { NewNoteCard } from '@/components/new-note-card'
import { NoteCard } from '@/components/note-card'
import { useAuth } from '@/context/auth'
import { useStorage } from '@/hooks/useStorage'

type Note = {
  id: string
  date: Date
  content: string
}

export function Notes() {
  const { user } = useAuth()
  const [notes, setNotes] = useStorage<Note[]>('notes', [])
  const searchParams = useSearchParams()
  const search = searchParams.get('q')

  if (!user) {
    redirect('/')
  }

  function onNoteCreated(content: string) {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content,
      date: new Date()
    }
    const notesArray = [newNote, ...notes]
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onDeleteNote(id: string) {
    const notesArray = notes.filter((note) => note.id !== id)
    setNotes(notesArray)
  }

  const filteredNotes =
    search && search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes

  return (
    <Suspense>
      <NewNoteCard onNoteCreated={onNoteCreated} />
      {filteredNotes.map((note) => (
        <NoteCard key={note.id} onDeleteNote={onDeleteNote} {...note} />
      ))}
    </Suspense>
  )
}
