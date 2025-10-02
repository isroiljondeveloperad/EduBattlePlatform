"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Calendar } from "lucide-react"

interface WeeklyRanking {
  id: string
  user_id: string
  week_start: string
  week_end: string
  total_points: number
  rank: number
  users: {
    name: string
    email: string
    avatar_url?: string
  }
}

export function WeeklyRankings() {
  const [rankings, setRankings] = useState<WeeklyRanking[]>([])
  const [weekStart, setWeekStart] = useState("")
  const [weekEnd, setWeekEnd] = useState("")

  useEffect(() => {
    fetchWeeklyRankings()
  }, [])

  const fetchWeeklyRankings = async () => {
    try {
      // Calculate current week
      const now = new Date()
      const dayOfWeek = now.getDay()
      const start = new Date(now)
      start.setDate(now.getDate() - dayOfWeek)
      start.setHours(0, 0, 0, 0)

      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)

      setWeekStart(start.toLocaleDateString())
      setWeekEnd(end.toLocaleDateString())

      // Fetch rankings from API
      const response = await fetch("/api/weekly-rankings/current")
      if (response.ok) {
        const data = await response.json()
        setRankings(data.rankings || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching weekly rankings:", error)
    }
  }

  const getRankSticker = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <Trophy className="w-7 h-7 text-white" />
          </div>
        )
      case 2:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
            <Medal className="w-7 h-7 text-white" />
          </div>
        )
      case 3:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
            <Award className="w-7 h-7 text-white" />
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-lg">#{rank}</span>
          </div>
        )
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-50 to-yellow-100 border-yellow-300"
      case 2:
        return "from-gray-50 to-gray-100 border-gray-300"
      case 3:
        return "from-amber-50 to-amber-100 border-amber-300"
      default:
        return "from-white to-gray-50 border-gray-200"
    }
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Weekly Rankings
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {weekStart} - {weekEnd}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankings.slice(0, 10).map((ranking) => (
            <Card key={ranking.id} className={`bg-gradient-to-br ${getRankColor(ranking.rank)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getRankSticker(ranking.rank)}
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={ranking.users.avatar_url || "/student-avatar.png"} />
                      <AvatarFallback>{ranking.users.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{ranking.users.name}</p>
                      <p className="text-sm text-muted-foreground">{ranking.users.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{ranking.total_points}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
