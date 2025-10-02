"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, Star, TrendingUp, Users, Search, Filter, Crown } from "lucide-react"

interface StudentProgress {
  id: string
  name: string
  email: string
  avatar?: string
  totalPoints: number
  battlesWon: number
  battlesPlayed: number
  winRate: number
  currentStreak: number
  level: number
  rank: number
  isPremium: boolean
}

export default function ProgressPage() {
  const { language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rank" | "points" | "winRate" | "battles">("rank")
  const [filterBy, setFilterBy] = useState<"all" | "premium" | "free">("all")
  const [students, setStudents] = useState<StudentProgress[]>([])

  useEffect(() => {
    // Load all registered users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("edubattle_all_users") || "[]")

    const studentData = allUsers
      .filter((u: any) => u.role === "student")
      .map((u: any, index: number) => {
        const stats = JSON.parse(localStorage.getItem("edubattle_user_stats") || "[]")
        const userStats = stats.find((s: any) => s.userId === u.id) || {
          testsCompleted: 0,
          tournamentsWon: 0,
          totalPoints: 0,
          correctAnswers: 0,
        }

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar || "/student-avatar.png",
          totalPoints: userStats.totalPoints,
          battlesWon: userStats.tournamentsWon,
          battlesPlayed: userStats.testsCompleted,
          winRate:
            userStats.testsCompleted > 0 ? Math.round((userStats.tournamentsWon / userStats.testsCompleted) * 100) : 0,
          currentStreak: 0,
          level: Math.floor(userStats.totalPoints / 1000) + 1,
          rank: index + 1,
          isPremium: u.isPremium || false,
        }
      })
      .sort((a: any, b: any) => b.totalPoints - a.totalPoints)
      .map((s: any, index: number) => ({ ...s, rank: index + 1 }))

    setStudents(studentData)
  }, [])

  const getRankSticker = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-yellow-600 font-bold">1st Place</span>
          </div>
        )
      case 2:
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
              <Medal className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-600 font-bold">2nd Place</span>
          </div>
        )
      case 3:
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="text-amber-700 font-bold">3rd Place</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">#{rank}</span>
            </div>
            <span className="text-gray-600">#{rank}</span>
          </div>
        )
    }
  }

  const filteredAndSortedStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "premium" && student.isPremium) ||
        (filterBy === "free" && !student.isPremium)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "points":
          return b.totalPoints - a.totalPoints
        case "winRate":
          return b.winRate - a.winRate
        case "battles":
          return b.battlesWon - a.battlesWon
        default:
          return a.rank - b.rank
      }
    })

  const topPerformers = filteredAndSortedStudents.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="EduBattle Admin" showBackButton />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{language === "uz" ? "Taraqqiyot Kuzatuvi" : "Progress Tracking"}</h1>
          <p className="text-muted-foreground">
            {language === "uz"
              ? "O'quvchilar taraqqiyotini kuzatish va tahlil qilish"
              : "Monitor and analyze student progress"}
          </p>
        </div>

        {/* Top 3 Performers with Stickers */}
        {topPerformers.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                {language === "uz" ? "Eng Yaxshi 3 O'quvchi" : "Top 3 Performers"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {topPerformers.map((student, index) => (
                  <Card
                    key={student.id}
                    className={`relative overflow-hidden ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300"
                        : index === 1
                          ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300"
                          : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">{getRankSticker(student.rank)}</div>
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarImage src={student.avatar || "/student-avatar.png"} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg mb-1">{student.name}</h3>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-purple-600">{student.totalPoints}</span>
                        <span className="text-sm text-muted-foreground">points</span>
                        {student.isPremium && <Crown className="w-4 h-4 text-purple-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {student.battlesWon}/{student.battlesPlayed} wins • {student.winRate}% rate
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Level {student.level}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "uz" ? "Jami O'quvchilar" : "Total Students"}
                  </p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "uz" ? "O'rtacha Ball" : "Average Score"}
                  </p>
                  <p className="text-2xl font-bold">
                    {students.length > 0
                      ? Math.round(students.reduce((acc, s) => acc + s.totalPoints, 0) / students.length)
                      : 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "uz" ? "Premium Foydalanuvchilar" : "Premium Users"}
                  </p>
                  <p className="text-2xl font-bold">{students.filter((s) => s.isPremium).length}</p>
                </div>
                <Crown className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "uz" ? "O'rtacha G'alaba" : "Avg Win Rate"}
                  </p>
                  <p className="text-2xl font-bold">
                    {students.length > 0
                      ? Math.round(students.reduce((acc, s) => acc + s.winRate, 0) / students.length)
                      : 0}
                    %
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={language === "uz" ? "O'quvchi qidirish..." : "Search students..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank">{language === "uz" ? "Reyting" : "Rank"}</SelectItem>
                  <SelectItem value="points">{language === "uz" ? "Ballar" : "Points"}</SelectItem>
                  <SelectItem value="winRate">{language === "uz" ? "G'alaba foizi" : "Win Rate"}</SelectItem>
                  <SelectItem value="battles">{language === "uz" ? "Janglar" : "Battles Won"}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "uz" ? "Barchasi" : "All"}</SelectItem>
                  <SelectItem value="premium">{language === "uz" ? "Premium" : "Premium"}</SelectItem>
                  <SelectItem value="free">{language === "uz" ? "Bepul" : "Free"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Progress Table */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "uz" ? "Batafsil Taraqqiyot" : "Detailed Progress"}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAndSortedStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Hali o'quvchilar yo'q</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "uz" ? "Reyting" : "Rank"}</TableHead>
                    <TableHead>{language === "uz" ? "O'quvchi" : "Student"}</TableHead>
                    <TableHead>{language === "uz" ? "Daraja" : "Level"}</TableHead>
                    <TableHead>{language === "uz" ? "Ballar" : "Points"}</TableHead>
                    <TableHead>{language === "uz" ? "Janglar" : "Battles"}</TableHead>
                    <TableHead>{language === "uz" ? "G'alaba foizi" : "Win Rate"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{getRankSticker(student.rank)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={student.avatar || "/student-avatar.png"} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {student.name}
                              {student.isPremium && <Crown className="w-4 h-4 text-purple-500" />}
                            </p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {student.level}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">{student.totalPoints}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {student.battlesWon}/{student.battlesPlayed}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.winRate} className="w-16 h-2" />
                          <span className="text-sm font-medium">{student.winRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
