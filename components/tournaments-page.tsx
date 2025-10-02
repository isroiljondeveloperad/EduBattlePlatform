"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Trophy, Users, Calendar, Search, Play, Award } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { dataStore } from "@/lib/data-store"

export function TournamentsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [tournaments, setTournaments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = () => {
    try {
      const tournamentsData = dataStore.getTournaments()
      setTournaments(tournamentsData)
    } catch (error) {
      console.error("[v0] Error loading tournaments:", error)
      toast({
        title: "Xatolik",
        description: "Turnirlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const statuses = ["all", "upcoming", "active", "completed"]

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || tournament.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleJoinTournament = (tournamentId: string) => {
    if (!user) {
      toast({
        title: "Xatolik",
        description: "Turnirga qo'shilish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    const success = dataStore.addParticipantToTournament(tournamentId, user.id)

    if (success) {
      loadTournaments()
      const tournament = tournaments.find((t) => t.id === tournamentId)
      toast({
        title: "Muvaffaqiyatli qo'shildingiz!",
        description: `Siz ${tournament?.name} turnirga qo'shildingiz`,
      })
    } else {
      toast({
        title: "Xatolik",
        description: "Turnirga qo'shilishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-battle-blue/10 text-battle-blue"
      case "active":
        return "bg-battle-green/10 text-battle-green"
      case "completed":
        return "bg-gray-500/10 text-gray-500"
      default:
        return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Kutilmoqda"
      case "active":
        return "Faol"
      case "completed":
        return "Yakunlangan"
      default:
        return status
    }
  }

  const isParticipant = (tournamentId: string) => {
    const tournament = tournaments.find((t) => t.id === tournamentId)
    return user && tournament && tournament.participants.includes(user.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-battle-green mb-4 animate-pulse" />
          <p className="text-muted-foreground">Turnirlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Boshqaruvga qaytish
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-green rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Turnirlar</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Turnirlar</h1>
          <p className="text-xl text-muted-foreground">Eng yaxshi o'quvchilar bilan raqobatlashing</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Turnirlarni qidirish..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                onClick={() => setSelectedStatus(status)}
                className={selectedStatus === status ? "bg-battle-green hover:bg-battle-green/90" : ""}
              >
                {status === "all" ? "Barchasi" : getStatusText(status)}
              </Button>
            ))}
          </div>
        </div>

        {filteredTournaments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Turnirlar topilmadi</h3>
              <p className="text-muted-foreground">Boshqa qidiruv so'rovini sinab ko'ring</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTournaments.map((tournament) => {
              const userIsParticipant = isParticipant(tournament.id)

              return (
                <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold">{tournament.name}</h3>
                          <Badge className={getStatusColor(tournament.status)}>
                            {getStatusText(tournament.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-battle-purple" />
                            <span>{tournament.participants.length} ishtirokchi</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-battle-blue" />
                            <span>{new Date(tournament.startDate).toLocaleDateString("uz-UZ")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-battle-yellow" />
                            <span>
                              {tournament.type === "team" ? "Jamoaviy" : tournament.type === "1vs1" ? "1vs1" : "Yakka"}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">{tournament.description}</p>
                      </div>

                      <div className="ml-4">
                        {tournament.status === "upcoming" && (
                          <>
                            {userIsParticipant ? (
                              <Badge className="bg-battle-green text-white">Qo'shildingiz</Badge>
                            ) : (
                              <Button
                                onClick={() => handleJoinTournament(tournament.id)}
                                className="bg-battle-green hover:bg-battle-green/90"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Qo'shilish
                              </Button>
                            )}
                          </>
                        )}
                        {tournament.status === "active" && userIsParticipant && (
                          <Link href={`/tournament/${tournament.id}`}>
                            <Button className="bg-battle-purple hover:bg-battle-purple/90">
                              <Play className="w-4 h-4 mr-2" />
                              Boshlash
                            </Button>
                          </Link>
                        )}
                        {tournament.status === "completed" && (
                          <Link href={`/tournament/${tournament.id}/results`}>
                            <Button variant="outline">Natijalar</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
