"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { dataStore } from "./data-store"

interface User {
  id: string
  name: string
  email?: string
  role: "student" | "admin"
  isPremium?: boolean
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("edubattle_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (userData: User) => {
    setUser(userData)
    localStorage.setItem("edubattle_user", JSON.stringify(userData))

    dataStore.saveUserToAllUsers({
      id: userData.id,
      name: userData.name,
      email: userData.email,
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("edubattle_user")
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
