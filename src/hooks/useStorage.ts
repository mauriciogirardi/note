'use client'

import { useEffect, useState } from 'react'

type StorageType = 'localStorage' | 'sessionStorage'

export const useStorage = <T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'localStorage'
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storage = window[storageType]
        const storedValue = storage.getItem(key)
        return storedValue ? JSON.parse(storedValue) : initialValue
      }
    } catch (error) {
      console.error(
        `Error retrieving value for key "${key}" from ${storageType}:`,
        error
      )
    }
    return initialValue
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storage = window[storageType]
        storage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(
        `Error storing value for key "${key}" in ${storageType}:`,
        error
      )
    }
  }, [key, value, storageType])

  return [value, setValue]
}
