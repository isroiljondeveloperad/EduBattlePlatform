"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Trophy, Medal, Award, Crown } from "lucide-react"
import Link from "next/link"
import { dataStore, type Tournament, type TournamentScore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"

interface TournamentResultsPageProps {
  tournamentId: string
}

export function TournamentResultsPage({ tournamentId }: TournamentResultsPageProps) {
  const { user } = useAuth()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [leaderboard, setLeaderboard] = useState<TournamentScore[]>([])

  useEffect(() => {
    const loadedTournament = dataStore.getTournaments().find((t) => t.id === tournamentId)
    if (loadedTournament) {
      setTournament(loadedTournament)
      const scores = dataStore.getTournamentLeaderboard(tournamentId)
      setLeaderboard(scores)
    }
  }, [tournamentId])

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Turnir topilmadi</h2>
            <Link href="/tournaments">
              <Button>Turnirlarga qaytish</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userScore = leaderboard.find((s) => s.userId === user?.id)
  const userRank = userScore ? leaderboard.findIndex((s) => s.userId === user?.id) + 1 : null

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />
      default:
        return null
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500"
      case 2:
        return "bg-gray-400/10 border-gray-400"
      case 3:
        return "bg-orange-600/10 border-orange-600"
      default:
        return "bg-muted border-border"
    }
  }

  return (
    <div className="min-h-screen bg-background">
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
              <Trophy className="w-6 h-6 text-battle-green" />
              <span className="text-xl font-bold">Turnir natijalari</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <div className="text-center">
              <Trophy className="w-16 h-16 mx-auto text-battle-green mb-4" />
              <CardTitle className="text-3xl mb-2">{tournament.name}</CardTitle>
              <Badge className="bg-battle-green/10 text-battle-green">
                {tournament.status === "completed" ? "Yakunlangan" : "Faol"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-battle-purple">{leaderboard.length}</div>
                <div className="text-sm text-muted-foreground">Ishtirokchilar</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-battle-yellow">{tournament.prizePool}</div>
                <div className="text-sm text-muted-foreground">Mukofot fondi</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-battle-blue">{tournament.duration}</div>
                <div className="text-sm text-muted-foreground">Daqiqa</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {userScore && userRank && (
          <Card className="mb-8 border-2 border-battle-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-battle-purple">#{userRank}</div>
                    <div className="text-sm text-muted-foreground">Sizning o'rningiz</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-2xl font-bold">{userScore.score.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">{userScore.correctAnswers} ta to'g'ri javob</div>
                  </div>
                </div>
                {userRank <= 3 && (
                  <div className="flex items-center gap-2">
                    {getRankIcon(userRank)}
                    <span className="font-semibold">
                      {userRank === 1 ? "Birinchi o'rin!" : userRank === 2 ? "Ikkinchi o'rin!" : "Uchinchi o'rin!"}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Liderlar taxtasi</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Hali natijalar yo'q</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((score, index) => {
                  const rank = index + 1
                  const isCurrentUser = score.userId === user?.id

                  return (
                    <div
                      key={score.userId}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrentUser ? "border-battle-purple bg-battle-purple/5" : getRankColor(rank)
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border-2">
                          {rank <= 3 ? getRankIcon(rank) : <span className="font-bold text-lg">#{rank}</span>}
                        </div>

                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-battle-purple text-white">
                            {score.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{score.userName}</h3>
                            {isCurrentUser && (
                              <Badge variant="outline" className="bg-battle-purple/10 text-battle-purple">
                                Siz
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{score.correctAnswers} ta to'g'ri javob</p>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-battle-green">{score.score.toFixed(0)}%</div>
                          {rank <= tournament.prizes.length && (
                            <div className="flex items-center gap-1 text-sm text-battle-yellow">
                              <Award className="w-4 h-4" />
                              <span>{tournament.prizes[rank - 1]} ochko</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Link href="/tournaments" className="flex-1">
            <Button className="w-full bg-transparent" variant="outline">
              Boshqa turnirlar
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full bg-battle-purple hover:bg-battle-purple/90">Boshqaruvga qaytish</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
