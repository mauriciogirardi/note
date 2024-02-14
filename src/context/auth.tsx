'use client'

import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { toast } from 'sonner'

import { useStorage } from '@/hooks/useStorage'
import { auth } from '@/lib/firebase'

type AuthContextProviderProps = {
  children: ReactNode
}

type UserData = Pick<User, 'displayName' | 'email' | 'photoURL'>

type AuthContextProps = {
  user: UserData | null
  onGoogleSignIn: () => Promise<void>
  onLogout: () => Promise<void>
  isSignIn: boolean
  isSignOut: boolean
}

const AuthContext = createContext({} as AuthContextProps)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const router = useRouter()

  const [isSignIn, setIsSignIn] = useState(false)
  const [isSignOut, setIsSignOut] = useState(false)
  const [user, setUser] = useStorage<UserData | null>(
    'user-note',
    {} as UserData | null
  )

  const onGoogleSignIn = async () => {
    try {
      setIsSignIn(true)
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      setUser({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      })
      router.push('/note')
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          toast.warning('Usuário fechou o popup sem se autenticar!')
          return
        }
      }
      toast.error('Error ao fazer login na aplicação, tente novamente!')
    } finally {
      setIsSignIn(false)
    }
  }

  const onLogout = async () => {
    try {
      setIsSignOut(true)
      await signOut(auth)
      setUser(null)
    } catch {
      toast.error('Error ao fazer logout da aplicação, tente novamente!')
    } finally {
      setIsSignOut(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [setUser])

  return (
    <AuthContext.Provider
      value={{ user, isSignOut, isSignIn, onGoogleSignIn, onLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
