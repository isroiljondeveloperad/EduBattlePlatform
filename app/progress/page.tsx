"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Medal, Star, Target, BookOpen } from "lucide-react"
import Link from "next/link"
import { dataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"

export default function ProgressPage() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState({
    testsCompleted: 0,
    tournamentsWon: 0,
    totalPoints: 0,
    correctAnswers: 0,
  })

  useEffect(() => {
    if (user) {
      const stats = dataStore.getUserStats(user.id)
      setUserStats(stats)
    }
  }, [user])

  const totalTests = dataStore.getTests().filter((t) => t.status === "active").length
  const completionRate = totalTests > 0 ? Math.round((userStats.testsCompleted / totalTests) * 100) : 0
  const averageScore =
    userStats.testsCompleted > 0 ? Math.round((userStats.correctAnswers / userStats.testsCompleted) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <span className="text-xl font-bold">Taraqqiyot</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Sizning Taraqqiyotingiz</h1>
          <p className="text-xl text-muted-foreground">Yutuqlaringiz va statistikangizni ko'ring</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-battle-yellow" />
              <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Jami ochkolar</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-battle-green" />
              <div className="text-2xl font-bold">{userStats.testsCompleted}</div>
              <div className="text-sm text-muted-foreground">Testlar yechildi</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Medal className="w-8 h-8 mx-auto mb-2 text-battle-blue" />
              <div className="text-2xl font-bold">{userStats.tournamentsWon}</div>
              <div className="text-sm text-muted-foreground">Turnir g'alabalari</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-battle-purple" />
              <div className="text-2xl font-bold">{userStats.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">To'g'ri javoblar</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Umumiy ko'rinish</TabsTrigger>
            <TabsTrigger value="details">Batafsil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Umumiy statistika</CardTitle>
                <CardDescription>Sizning o'quv faoliyatingiz haqida umumiy ma'lumot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Testlarni yakunlash darajasi</span>
                    <span>{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>O'rtacha natija</span>
                    <span>{averageScore}%</span>
                  </div>
                  <Progress value={averageScore} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-battle-green">{userStats.correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">To'g'ri javoblar</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-battle-purple">{userStats.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Jami ochkolar</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yutuqlar</CardTitle>
                <CardDescription>Qo'lga kiritilgan yutuqlar va mukofotlar</CardDescription>
              </CardHeader>
              <CardContent>
                {userStats.testsCompleted === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Hali yutuqlar yo'q</p>
                    <Link href="/tests">
                      <Button className="bg-battle-purple hover:bg-battle-purple/90">Birinchi testni boshlash</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userStats.testsCompleted >= 1 && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <div className="text-4xl mb-2">🎯</div>
                        <div className="font-semibold text-sm">Birinchi test</div>
                      </div>
                    )}
                    {userStats.testsCompleted >= 5 && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <div className="text-4xl mb-2">⭐</div>
                        <div className="font-semibold text-sm">5 ta test</div>
                      </div>
                    )}
                    {userStats.testsCompleted >= 10 && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <div className="text-4xl mb-2">🏆</div>
                        <div className="font-semibold text-sm">10 ta test</div>
                      </div>
                    )}
                    {userStats.tournamentsWon >= 1 && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <div className="text-4xl mb-2">👑</div>
                        <div className="font-semibold text-sm">Turnir g'olibi</div>
                      </div>
                    )}
                    {userStats.totalPoints >= 100 && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <div className="text-4xl mb-2">💯</div>
                        <div className="font-semibold text-sm">100 ochko</div>
                      </div>
                    )}
                    {userStats.totalPoints >= 500 && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <div className="text-4xl mb-2">🌟</div>
                        <div className="font-semibold text-sm">500 ochko</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batafsil statistika</CardTitle>
                <CardDescription>Sizning faoliyatingiz haqida to'liq ma'lumot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-8 h-8 text-battle-blue" />
                      <div>
                        <div className="font-semibold">Testlar yechildi</div>
                        <div className="text-sm text-muted-foreground">Jami testlar soni</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-battle-blue">{userStats.testsCompleted}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-battle-green" />
                      <div>
                        <div className="font-semibold">Turnir g'alabalari</div>
                        <div className="text-sm text-muted-foreground">Yutilgan turnirlar</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-battle-green">{userStats.tournamentsWon}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="w-8 h-8 text-battle-yellow" />
                      <div>
                        <div className="font-semibold">Jami ochkolar</div>
                        <div className="text-sm text-muted-foreground">To'plangan barcha ochkolar</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-battle-yellow">{userStats.totalPoints}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-8 h-8 text-battle-purple" />
                      <div>
                        <div className="font-semibold">To'g'ri javoblar</div>
                        <div className="text-sm text-muted-foreground">Barcha to'g'ri javoblar</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-battle-purple">{userStats.correctAnswers}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
