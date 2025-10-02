"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Users, Clock, DollarSign, Medal, Target, Zap, Swords } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"

interface TournamentDetailProps {
  tournamentId: string
}

export function TournamentDetail({ tournamentId }: TournamentDetailProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [hasJoined, setHasJoined] = useState(false)
  const [isBattling, setIsBattling] = useState(false)
  const [tournament, setTournament] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [recentMatches, setRecentMatches] = useState<any[]>([])

  useEffect(() => {
    // Load tournament data
    const tournaments = dataStore.getTournaments()
    const foundTournament = tournaments.find((t) => t.id === tournamentId)

    if (foundTournament) {
      setTournament(foundTournament)
      setHasJoined(user ? foundTournament.participants.includes(user.id) : false)

      // Load leaderboard
      const tournamentLeaderboard = dataStore.getTournamentLeaderboard(tournamentId)
      setLeaderboard(tournamentLeaderboard)

      // Load recent matches
      const matches = dataStore.getTournamentMatches(tournamentId)
      setRecentMatches(matches.filter((m) => m.status === "completed").slice(0, 5))
    }
  }, [tournamentId, user])

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-battle-green mb-4" />
          <p className="text-muted-foreground">Turnir topilmadi</p>
        </div>
      </div>
    )
  }

  const startBattle = () => {
    if (!user) {
      toast({
        title: "Xatolik",
        description: "Jang boshlash uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    if (!hasJoined) {
      toast({
        title: "Avval qo'shiling!",
        description: "Jang boshlash uchun avval turnirga qo'shilishingiz kerak.",
        variant: "destructive",
      })
      return
    }

    if (tournament.type === "1vs1") {
      router.push(`/tournament/${tournamentId}/battle`)
    } else {
      router.push(`/tournament/${tournamentId}`)
    }
  }

  const joinTournament = () => {
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
      setHasJoined(true)
      toast({
        title: "Turnirga qo'shildingiz!",
        description: `${tournament.name} turnirida muvaffaqiyat tilaymiz!`,
      })
    } else {
      toast({
        title: "Xatolik",
        description: "Turnirga qo'shilishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-battle-yellow"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-battle-yellow"
      case 2:
        return "bg-gray-400"
      case 3:
        return "bg-amber-600"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/tournaments">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Turnirlarga qaytish
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-green rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{tournament.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tournament Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold">{tournament.name}</h1>
                <Badge
                  className={
                    tournament.status === "active" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                  }
                >
                  {tournament.status === "active" && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                  )}
                  {tournament.status === "active"
                    ? "JONLI"
                    : tournament.status === "upcoming"
                      ? "KUTILMOQDA"
                      : "YAKUNLANGAN"}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground mb-4">{tournament.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {tournament.subject}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {tournament.duration} daqiqa
                </span>
                <Badge variant="outline">
                  {tournament.type === "1vs1" ? "1vs1 Jang" : tournament.type === "team" ? "Jamoaviy" : "Yakka"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tournament Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-battle-blue" />
                <div className="text-2xl font-bold">{tournament.participants.length}</div>
                <div className="text-sm text-muted-foreground">Ishtirokchilar</div>
                <Progress
                  value={(tournament.participants.length / tournament.maxParticipants) * 100}
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-battle-yellow" />
                <div className="text-2xl font-bold">${tournament.prizePool}</div>
                <div className="text-sm text-muted-foreground">Mukofot fondi</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-battle-green" />
                <div className="text-2xl font-bold">{hasJoined ? "Qo'shildingiz" : "-"}</div>
                <div className="text-sm text-muted-foreground">Holatingiz</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Medal className="w-8 h-8 mx-auto mb-2 text-battle-purple" />
                <div className="text-2xl font-bold">{user ? dataStore.getUserStats(user.id).totalPoints : 0}</div>
                <div className="text-sm text-muted-foreground">Sizning balingiz</div>
              </CardContent>
            </Card>
          </div>

          {/* Join/Battle Buttons */}
          {!hasJoined ? (
            <div className="text-center">
              <Button
                onClick={joinTournament}
                className="bg-battle-purple hover:bg-battle-purple/90 px-8 py-3 text-lg"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Turnirga qo'shilish
              </Button>
            </div>
          ) : (
            <div className="text-center space-x-4">
              <Button
                onClick={startBattle}
                disabled={isBattling}
                className="bg-battle-green hover:bg-battle-green/90 px-8 py-3 text-lg"
                size="lg"
              >
                <Swords className="w-5 h-5 mr-2" />
                {isBattling ? "Raqib izlanmoqda..." : "Jangni boshlash"}
              </Button>
              <Link href={`/tournament/${tournament.id}/practice`}>
                <Button variant="outline" className="px-8 py-3 text-lg bg-transparent" size="lg">
                  <Target className="w-5 h-5 mr-2" />
                  Mashq qilish
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Tournament Content */}
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">Peshqadamlar</TabsTrigger>
            <TabsTrigger value="matches">So'nggi janglar</TabsTrigger>
            <TabsTrigger value="rules">Qoidalar va ma'lumot</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-battle-yellow" />
                  Turnir peshqadamlari
                </CardTitle>
                <CardDescription>Ushbu turnirdagi eng yaxshi natijalar</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Hali natijalar yo'q</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((player, index) => {
                      const rank = index + 1
                      return (
                        <div
                          key={player.userId}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${rank <= 3 ? "bg-muted/50" : ""}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${getRankBg(
                              rank,
                            )}`}
                          >
                            {rank}
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-battle-purple/10 text-battle-purple">
                              {player.userName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold">{player.userName}</div>
                            <div className="text-sm text-muted-foreground">{player.correctAnswers} to'g'ri javob</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getRankColor(rank)}`}>{player.score}</div>
                            <div className="text-sm text-muted-foreground">ball</div>
                          </div>
                          {rank <= 3 && <Medal className={`w-6 h-6 ${getRankColor(rank)}`} />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi janglar</CardTitle>
                <CardDescription>Ushbu turnirdagi eng so'nggi natijalar</CardDescription>
              </CardHeader>
              <CardContent>
                {recentMatches.length === 0 ? (
                  <div className="text-center py-12">
                    <Swords className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Hali janglar bo'lmagan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-semibold">{match.player1Name}</div>
                            <div className="text-2xl font-bold text-battle-blue">{match.player1Score}</div>
                          </div>
                          <div className="text-muted-foreground">vs</div>
                          <div className="text-center">
                            <div className="font-semibold">{match.player2Name}</div>
                            <div className="text-2xl font-bold text-battle-purple">{match.player2Score}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-battle-green">
                            G'olib: {match.winnerId === match.player1Id ? match.player1Name : match.player2Name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(match.completedAt).toLocaleString("uz-UZ")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Turnir qoidalari</CardTitle>
                <CardDescription>Ushbu turnir haqida bilishingiz kerak bo'lgan hamma narsa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Format</h4>
                  <p className="text-muted-foreground">
                    Bu {tournament.type === "1vs1" ? "1vs1 jang" : tournament.type === "team" ? "jamoaviy" : "yakka"}{" "}
                    turnir bo'lib, ishtirokchilar faol davr mobaynida istalgan vaqtda janglarga qo'shilishlari mumkin.
                    Har bir jang {tournament.duration} daqiqa ichida bajarilishi kerak.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ball hisoblash</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>To'g'ri javob: +{tournament.type === "1vs1" ? "7" : "3"} ball</li>
                    <li>Noto'g'ri javob: 0 ball</li>
                    <li>Vaqt bonusi: Tezlikka qarab har savol uchun +50 ballgacha</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Mukofotlar</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>1-o'rin: ${tournament.prizes?.[0] || tournament.prizePool * 0.5} + Chempion nishoni</li>
                    <li>2-o'rin: ${tournament.prizes?.[1] || tournament.prizePool * 0.3} + Kumush nishoni</li>
                    <li>3-o'rin: ${tournament.prizes?.[2] || tournament.prizePool * 0.2} + Bronza nishoni</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Adolatli o'yin</h4>
                  <p className="text-muted-foreground">
                    Barcha ishtirokchilar adolatli raqobat qilishlari shart. Tashqi yordam, aldash vositalari yoki har
                    qanday noto'g'ri xatti-harakatlar darhol diskvalifikatsiya va hisob bloklash bilan yakunlanadi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
