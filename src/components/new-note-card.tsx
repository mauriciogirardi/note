/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Dialog } from './ui/dialog'

const formSchema = z.object({
  content: z.string().min(1)
})

type FormSchema = z.infer<typeof formSchema>
type NewNoteCardProps = {
  onNoteCreated: (content: string) => void
}

const SpeechRecognitionAPI =
  (typeof window !== 'undefined' && (window as any).SpeechRecognition) ||
  (window as any).webkitSpeechRecognition

const speechRecognition = new SpeechRecognitionAPI()

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isOpenCard, setIsOpenCard] = useState(false)

  const {
    watch,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid }
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })

  function handleStartEditor() {
    setShouldShowOnBoarding(false)
  }

  function handleSaveNote(data: FormSchema) {
    onNoteCreated(data.content)
    reset({ content: '' })
    setIsOpenCard(false)
    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.warning('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }

    setIsRecording(true)
    setShouldShowOnBoarding(false)

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event: any) => {
      const transcription = Array.from(event.results).reduce(
        (text: string, result: any) => {
          return text.concat(result[0].transcript)
        },
        ''
      )
      setValue('content', transcription)
    }
    speechRecognition.onerror = (event: any) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  useEffect(() => {
    const content = watch((value) => {
      if (value.content === '') setShouldShowOnBoarding(true)
    })
    return () => content.unsubscribe()
  }, [watch])

  function handleCloseDialog(open: boolean) {
    setIsOpenCard(open)
    setIsRecording(false)
    setValue('content', '')
    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root
      open={isOpenCard}
      onOpenChange={(open) => handleCloseDialog(open)}
    >
      <Dialog.Trigger className="flex flex-col space-y-3 rounded-md bg-slate-700 p-5 text-left shadow-lg outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 flex h-[60vh] w-full max-w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md bg-slate-700 outline-none md:max-w-[640px]">
          <Dialog.DialogClose className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 outline-none transition-colors hover:bg-slate-900 focus-visible:bg-slate-900">
            <X className="size-5" />
          </Dialog.DialogClose>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowOnBoarding && (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 outline-none hover:underline focus-visible:underline"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 outline-none hover:underline focus-visible:underline"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              )}

              {!shouldShowOnBoarding && (
                <textarea
                  autoFocus
                  className="flex-1 resize-none bg-slate-700 leading-6 text-slate-400 outline-none"
                  {...register('content')}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex w-full items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm font-medium text-slate-300 outline-none  focus-visible:bg-lime-500 enabled:hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="size-3 animate-pulse rounded-full bg-red-500" />
                Gravando! (Clique p/ interromper)
              </button>
            ) : (
              <button
                disabled={!isValid}
                onClick={handleSubmit(handleSaveNote)}
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm font-medium text-slate-900 outline-none  focus-visible:bg-lime-500 enabled:hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
