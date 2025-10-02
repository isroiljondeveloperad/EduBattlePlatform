"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"

interface LeaderboardEntry {
  userId: string
  name: string
  totalPoints: number
  testsCompleted: number
  tournamentsWon: number
  isPremium: boolean
}

export default function LeaderboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = () => {
    try {
      const allUsers = dataStore.getAllUsers()
      const leaderboardData: LeaderboardEntry[] = allUsers
        .map((u) => {
          const stats = dataStore.getUserStats(u.id)
          return {
            userId: u.id,
            name: u.name,
            totalPoints: stats.totalPoints,
            testsCompleted: stats.testsCompleted,
            tournamentsWon: stats.tournamentsWon,
            isPremium: false, // We don't track premium status in the user list
          }
        })
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 50)

      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error("[v0] Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        )
    }
  }

  const getRankSticker = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            1-o'rin
          </div>
        )
      case 2:
        return (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Medal className="w-3 h-3" />
            2-o'rin
          </div>
        )
      case 3:
        return (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Award className="w-3 h-3" />
            3-o'rin
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-battle-purple animate-pulse mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Boshqaruvga qaytish
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-battle-purple rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">{t("progress.leaderboard")}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">{t("progress.leaderboard")}</h1>
          <p className="text-xl text-muted-foreground text-pretty">Eng yaxshi o'quvchilar va ularning yutuqlari</p>
        </div>

        {leaderboard.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hali reyting yo'q</h3>
              <p className="text-muted-foreground mb-4">
                Birinchi bo'lib testlarni yeching va liderlar jadvaliga kiring!
              </p>
              <Link href="/tests">
                <Button className="bg-battle-purple hover:bg-battle-purple/90">Testlarni boshlash</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-center mb-8">Top 3 O'quvchilar</h2>
                <div className="flex justify-center items-end gap-4 mb-8">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-2">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-white text-gray-700">
                            {leaderboard[1].name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white text-xs px-2 py-1 rounded-full">
                        2
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm">{leaderboard[1].name}</h3>
                    <p className="text-xs text-muted-foreground">{leaderboard[1].totalPoints} ochko</p>
                    <div className="w-16 h-20 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg mt-2 mx-auto"></div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2">
                        <Avatar className="w-20 h-20">
                          <AvatarFallback className="bg-white text-yellow-700">
                            {leaderboard[0].name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                        1
                      </div>
                      <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="font-semibold">{leaderboard[0].name}</h3>
                    <p className="text-sm text-muted-foreground">{leaderboard[0].totalPoints} ochko</p>
                    <div className="w-20 h-24 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-lg mt-2 mx-auto"></div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center mb-2">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-white text-amber-700">
                            {leaderboard[2].name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white text-xs px-2 py-1 rounded-full">
                        3
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm">{leaderboard[2].name}</h3>
                    <p className="text-xs text-muted-foreground">{leaderboard[2].totalPoints} ochko</p>
                    <div className="w-16 h-16 bg-gradient-to-t from-amber-500 to-amber-700 rounded-t-lg mt-2 mx-auto"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-battle-purple" />
                  To'liq Reyting Jadvali
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((student, index) => {
                    const rank = index + 1
                    const isCurrentUser = student.userId === user?.id

                    return (
                      <div
                        key={student.userId}
                        className={`relative flex items-center gap-4 p-4 rounded-lg border ${
                          isCurrentUser
                            ? "border-battle-purple bg-battle-purple/5"
                            : rank <= 3
                              ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
                              : "bg-card"
                        }`}
                      >
                        {getRankSticker(rank)}

                        <div className="flex items-center gap-3">
                          {getRankIcon(rank)}
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-battle-purple text-white">
                              {student.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            {student.isPremium && <Crown className="w-4 h-4 text-battle-purple" />}
                            {isCurrentUser && (
                              <Badge variant="outline" className="bg-battle-purple/10 text-battle-purple">
                                Siz
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{student.testsCompleted} ta test</span>
                            <span>{student.tournamentsWon} ta g'alaba</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-battle-purple">{student.totalPoints}</div>
                          <div className="text-sm text-muted-foreground">ochko</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
