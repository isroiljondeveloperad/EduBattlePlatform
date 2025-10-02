"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Plus, Crown, Trophy, MessageCircle, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { dataStore, type Team } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"

export function TeamsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    subject: "",
  })
  const [allTeams, setAllTeams] = useState<Team[]>([])

  useEffect(() => {
    setAllTeams(dataStore.getTeams())
  }, [])

  const myTeams = allTeams.filter((team) => team.members.some((m) => m.userId === user?.id))
  const availableTeams = allTeams.filter((team) => !team.members.some((m) => m.userId === user?.id))

  const topTeams = [...allTeams].sort((a, b) => b.points - a.points).slice(0, 10)

  const handleCreateTeam = () => {
    if (!user || !newTeam.name || !newTeam.subject) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      subject: newTeam.subject,
      leaderId: user.id,
      leaderName: user.name,
      members: [
        {
          userId: user.id,
          userName: user.name,
          joinedAt: new Date().toISOString(),
          role: "leader",
        },
      ],
      maxMembers: 10,
      points: 0,
      createdAt: new Date().toISOString(),
    }

    dataStore.saveTeam(team)
    setAllTeams(dataStore.getTeams())
    setIsCreateDialogOpen(false)
    setNewTeam({ name: "", description: "", subject: "" })

    toast({
      title: "Jamoa yaratildi!",
      description: `${team.name} jamoasi muvaffaqiyatli yaratildi`,
    })
  }

  const handleJoinTeam = (teamId: string) => {
    if (!user) {
      toast({
        title: "Xatolik",
        description: "Jamoaga qo'shilish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    const success = dataStore.joinTeam(teamId, user.id, user.name)

    if (success) {
      setAllTeams(dataStore.getTeams())
      toast({
        title: "Jamoaga qo'shildingiz!",
        description: "Siz muvaffaqiyatli jamoaga qo'shildingiz",
      })
    } else {
      toast({
        title: "Xatolik",
        description: "Jamoaga qo'shilishda xatolik yuz berdi",
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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Boshqaruvga qaytish
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-yellow rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jamolar</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Jamolar</h1>
            <p className="text-xl text-muted-foreground">Kuchlarni birlashtiring va birgalikda raqobatlashing</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-battle-yellow hover:bg-battle-yellow/90">
                <Plus className="w-4 h-4 mr-2" />
                Jamoa yaratish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yangi jamoa yaratish</DialogTitle>
                <DialogDescription>
                  O'z jamoangizni boshlang va boshqalarni qo'shilishga taklif qiling
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Jamoa nomi</Label>
                  <Input
                    id="teamName"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="masalan, Matematik sehrgarlar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamDescription">Tavsif</Label>
                  <Textarea
                    id="teamDescription"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    placeholder="Jamoangizning maqsadlari va yo'nalishini tasvirlab bering..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSubject">Asosiy fan</Label>
                  <Input
                    id="teamSubject"
                    value={newTeam.subject}
                    onChange={(e) => setNewTeam({ ...newTeam, subject: e.target.value })}
                    placeholder="masalan, Matematika, Fizika va h.k."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button className="bg-battle-yellow hover:bg-battle-yellow/90" onClick={handleCreateTeam}>
                    Jamoa yaratish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="my-teams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-teams">Mening jamolarim</TabsTrigger>
            <TabsTrigger value="browse">Jamolarni ko'rish</TabsTrigger>
            <TabsTrigger value="leaderboard">Jamolar reytingi</TabsTrigger>
          </TabsList>

          <TabsContent value="my-teams" className="space-y-6">
            {myTeams.length > 0 ? (
              <div className="grid gap-6">
                {myTeams.map((team, index) => {
                  const isOwner = team.leaderId === user?.id
                  const rank = topTeams.findIndex((t) => t.id === team.id) + 1

                  return (
                    <Card
                      key={team.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/team/${team.id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-2xl">{team.name}</CardTitle>
                              {isOwner && (
                                <Badge className="bg-battle-purple/10 text-battle-purple">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Egasi
                                </Badge>
                              )}
                              {rank > 0 && <Badge variant="outline">#{rank}-o'rin</Badge>}
                            </div>
                            <CardDescription>{team.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-battle-blue">
                              {team.members.length}/{team.maxMembers}
                            </div>
                            <div className="text-sm text-muted-foreground">A'zolar</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-battle-green">{team.points.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Ballar</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-battle-yellow">#{rank > 0 ? rank : "-"}</div>
                            <div className="text-sm text-muted-foreground">Global reyting</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-battle-purple">{team.subject}</div>
                            <div className="text-sm text-muted-foreground">Yo'nalish</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="bg-battle-yellow hover:bg-battle-yellow/90"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/team/${team.id}`)
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Jamoa chati
                          </Button>
                          <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                            <Users className="w-4 h-4 mr-2" />
                            A'zolar ({team.members.length})
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Hali jamolar yo'q</h3>
                  <p className="text-muted-foreground mb-4">
                    Birinchi jamoangizni yarating yoki mavjud jamoaga qo'shiling
                  </p>
                  <Button
                    className="bg-battle-yellow hover:bg-battle-yellow/90"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Birinchi jamoangizni yarating
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Jamolarni qidirish..." className="pl-10" />
              </div>
            </div>

            {availableTeams.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Qo'shilish uchun jamolar yo'q</h3>
                  <p className="text-muted-foreground">Yangi jamoa yarating!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {availableTeams.map((team, index) => {
                  const rank = topTeams.findIndex((t) => t.id === team.id) + 1

                  return (
                    <Card key={team.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{team.name}</h3>
                              {rank > 0 && <Badge variant="outline">#{rank}</Badge>}
                              <Badge className="bg-battle-blue/10 text-battle-blue">{team.subject}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{team.description}</p>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span>
                                {team.members.length}/{team.maxMembers} a'zo
                              </span>
                              <span>{team.points.toLocaleString()} ball</span>
                              <span>Rahbar: {team.leaderName}</span>
                            </div>
                          </div>
                          <Button
                            className="bg-battle-green hover:bg-battle-green/90"
                            onClick={() => handleJoinTeam(team.id)}
                            disabled={team.members.length >= team.maxMembers}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            {team.members.length >= team.maxMembers ? "To'la" : "Qo'shilish"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-battle-yellow" />
                  Jamolar reytingi
                </CardTitle>
                <CardDescription>Barcha fanlar bo'yicha eng yaxshi jamolar</CardDescription>
              </CardHeader>
              <CardContent>
                {topTeams.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Hali jamolar yo'q</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topTeams.map((team, index) => {
                      const rank = index + 1

                      return (
                        <div
                          key={team.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${rank <= 3 ? "bg-muted/50" : ""}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${getRankBg(
                              rank,
                            )}`}
                          >
                            {rank}
                          </div>
                          <div className="w-12 h-12 bg-battle-yellow/10 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-battle-yellow" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{team.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {team.members.length} a'zo • {team.subject}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getRankColor(rank)}`}>
                              {team.points.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">ball</div>
                          </div>
                          {rank <= 3 && <Trophy className={`w-6 h-6 ${getRankColor(rank)}`} />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
