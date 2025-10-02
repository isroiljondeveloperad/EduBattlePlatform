"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Crown, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
  title: string
  showBackButton?: boolean
}

export function AdminHeader({ title, showBackButton = false }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem("edubattle_admin_session")
    router.push("/admin/login")
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-purple rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{title}</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-battle-purple/10 text-battle-purple">
              <Crown className="w-3 h-3 mr-1" />
              Administrator
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
