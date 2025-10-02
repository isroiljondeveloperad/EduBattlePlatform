"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, Crown, MessageCircle, UserMinus, Send, UserPlus, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { dataStore, type Team, type TeamChatMessage } from "@/lib/data-store"

interface TeamDetailPageProps {
  teamId: string
}

export function TeamDetailPage({ teamId }: TeamDetailPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [team, setTeam] = useState<Team | null>(null)
  const [chatMessages, setChatMessages] = useState<TeamChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [allUsers, setAllUsers] = useState<Array<{ id: string; name: string; email?: string }>>([])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeamData()
    loadAllUsers()
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/teams/join/${teamId}`)
    }

    const interval = setInterval(() => {
      loadTeamData()
    }, 2000)

    return () => clearInterval(interval)
  }, [teamId])

  const loadTeamData = () => {
    try {
      const teamData = dataStore.getTeam(teamId)
      const messagesData = dataStore.getTeamChatMessages(teamId)

      setTeam(teamData)
      setChatMessages(messagesData)
    } catch (error) {
      console.error("[v0] Error loading team data:", error)
      toast({
        title: "Xatolik",
        description: "Jamoa ma'lumotlarini yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAllUsers = () => {
    try {
      const users = dataStore.getUsersNotInTeams()
      setAllUsers(users)
    } catch (error) {
      console.error("[v0] Error loading users:", error)
    }
  }

  const handleSendMessage = () => {
    if (!user || !newMessage.trim() || !team) return

    try {
      const message: TeamChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        teamId: teamId,
        userId: user.id,
        userName: user.name,
        message: newMessage,
        timestamp: new Date().toISOString(),
      }

      dataStore.saveTeamChatMessage(message)
      loadTeamData()
      setNewMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      toast({
        title: "Xatolik",
        description: "Xabar yuborishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleInviteMember = () => {
    if (!selectedUserId || !user) {
      toast({
        title: "Xatolik",
        description: "Iltimos, foydalanuvchini tanlang",
        variant: "destructive",
      })
      return
    }

    try {
      const selectedUser = allUsers.find((u) => u.id === selectedUserId)
      if (!selectedUser) return

      const success = dataStore.addUserToTeam(teamId, selectedUserId, selectedUser.name, user.id)

      if (!success) {
        toast({
          title: "Xatolik",
          description: "A'zoni qo'shishda xatolik yuz berdi",
          variant: "destructive",
        })
        return
      }

      loadTeamData()
      loadAllUsers()
      setShowInviteDialog(false)
      setSelectedUserId("")

      toast({
        title: "Muvaffaqiyatli!",
        description: "A'zo jamoaga qo'shildi",
      })
    } catch (error) {
      console.error("[v0] Error inviting member:", error)
      toast({
        title: "Xatolik",
        description: "A'zoni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    toast({
      title: "Nusxalandi!",
      description: "Taklif havolasi nusxalandi",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemoveMember = (memberId: string) => {
    if (!team || !user || team.leaderId !== user.id) return

    try {
      const teams = dataStore.getTeams()
      const currentTeam = teams.find((t) => t.id === teamId)
      if (!currentTeam) return

      currentTeam.members = currentTeam.members.filter((m) => m.userId !== memberId)
      dataStore.saveTeam(currentTeam)

      loadTeamData()
      loadAllUsers()

      toast({
        title: "A'zo olib tashlandi",
        description: "A'zo muvaffaqiyatli jamoadan olib tashlandi",
      })
    } catch (error) {
      console.error("[v0] Error removing member:", error)
      toast({
        title: "Xatolik",
        description: "A'zoni olib tashlashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleLeaveTeam = () => {
    if (!team || !user) return

    if (team.leaderId === user.id) {
      toast({
        title: "Xatolik",
        description: "Jamoa rahbari jamoani tark eta olmaydi. Avval rahbarlikni boshqasiga o'tkazing.",
        variant: "destructive",
      })
      return
    }

    try {
      const teams = dataStore.getTeams()
      const currentTeam = teams.find((t) => t.id === teamId)
      if (!currentTeam) return

      currentTeam.members = currentTeam.members.filter((m) => m.userId !== user.id)
      dataStore.saveTeam(currentTeam)

      router.push("/teams")

      toast({
        title: "Jamoadan chiqdingiz",
        description: "Siz muvaffaqiyatli jamoadan chiqdingiz",
      })
    } catch (error) {
      console.error("[v0] Error leaving team:", error)
      toast({
        title: "Xatolik",
        description: "Jamoadan chiqishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto text-battle-yellow mb-4 animate-pulse" />
          <p className="text-muted-foreground">Jamoa ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Jamoa topilmadi</h2>
            <Link href="/teams">
              <Button>Jamolarga qaytish</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isLeader = user && team.leaderId === user.id
  const isMember = user && team.members.some((m) => m.userId === user.id)

  const availableUsers = allUsers.filter((u) => !team.members.some((m) => m.userId === u.id))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/teams">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Jamolarga qaytish
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-yellow rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{team.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{team.name}</CardTitle>
                    <p className="text-muted-foreground">{team.description}</p>
                  </div>
                  {isLeader && (
                    <Badge className="bg-battle-purple/10 text-battle-purple">
                      <Crown className="w-3 h-3 mr-1" />
                      Rahbar
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-battle-blue">{team.members.length}</div>
                    <div className="text-sm text-muted-foreground">A'zolar</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-battle-green">{team.points.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Ballar</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="chat" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Jamoa chati</TabsTrigger>
                <TabsTrigger value="members">A'zolar ({team.members.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-battle-blue" />
                      Jamoa chati
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Hali xabarlar yo'q. Birinchi bo'lib yozing!</p>
                        </div>
                      ) : (
                        chatMessages.map((msg) => {
                          const isOwnMessage = msg.userId === user?.id
                          return (
                            <div
                              key={msg.id}
                              className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-battle-purple text-white text-xs">
                                  {msg.userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`flex-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold">{msg.userName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(msg.timestamp).toLocaleTimeString("uz-UZ", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div
                                  className={`inline-block px-4 py-2 rounded-lg ${
                                    isOwnMessage ? "bg-battle-purple text-white" : "bg-muted text-foreground"
                                  }`}
                                >
                                  {msg.message}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>

                    {isMember && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Xabar yozing..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} className="bg-battle-blue hover:bg-battle-blue/90">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-battle-green" />
                      Jamoa a'zolari
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {team.members.map((member) => {
                        const isTeamLeader = member.userId === team.leaderId
                        return (
                          <div key={member.userId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-battle-purple text-white">
                                  {member.userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{member.userName}</span>
                                  {isTeamLeader && (
                                    <Badge className="bg-battle-yellow/10 text-battle-yellow">
                                      <Crown className="w-3 h-3 mr-1" />
                                      Rahbar
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  Qo'shildi: {new Date(member.joinedAt).toLocaleDateString("uz-UZ")}
                                </span>
                              </div>
                            </div>

                            {isLeader && !isTeamLeader && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-600 bg-transparent"
                                  >
                                    <UserMinus className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>A'zoni olib tashlash</DialogTitle>
                                    <DialogDescription>
                                      {member.userName}ni jamoadan olib tashlashni xohlaysizmi?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Bekor qilish</Button>
                                    <Button variant="destructive" onClick={() => handleRemoveMember(member.userId)}>
                                      Olib tashlash
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Jamoa statistikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jami ballar</span>
                  <span className="font-bold text-battle-green">{team.points.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">A'zolar soni</span>
                  <span className="font-bold">{team.members.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yaratilgan</span>
                  <span className="font-bold">{new Date(team.createdAt).toLocaleDateString("uz-UZ")}</span>
                </div>
              </CardContent>
            </Card>

            {isLeader && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    A'zolarni taklif qilish
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Foydalanuvchilarni tanlang</Label>
                    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-battle-green hover:bg-battle-green/90">
                          <UserPlus className="w-4 h-4 mr-2" />
                          A'zo qo'shish
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[600px] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>A'zo qo'shish</DialogTitle>
                          <DialogDescription>Jamoaga qo'shmoqchi bo'lgan foydalanuvchini tanlang</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {availableUsers.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                              Qo'shish uchun foydalanuvchilar yo'q
                            </p>
                          ) : (
                            availableUsers.map((u) => (
                              <div
                                key={u.id}
                                className={`p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                                  selectedUserId === u.id ? "bg-battle-green/10 border-battle-green" : ""
                                }`}
                                onClick={() => setSelectedUserId(u.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarFallback className="bg-battle-blue text-white">
                                      {u.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-semibold">{u.name}</div>
                                    <div className="text-sm text-muted-foreground">{u.email}</div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                            Bekor qilish
                          </Button>
                          <Button
                            onClick={handleInviteMember}
                            disabled={!selectedUserId}
                            className="bg-battle-green hover:bg-battle-green/90"
                          >
                            Qo'shish
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    <Label>Taklif havolasi</Label>
                    <div className="flex gap-2">
                      <Input value={inviteLink} readOnly className="text-sm" />
                      <Button onClick={handleCopyInviteLink} variant="outline" className="bg-transparent" size="icon">
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bu havolani ulashib, boshqalarni jamoaga taklif qiling
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isMember && !isLeader && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Jamoani tark etish</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Jamoani tark etsangiz, qaytadan qo'shilish uchun taklif kerak bo'ladi.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full text-red-600 border-red-600 bg-transparent">
                        Jamoani tark etish
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Jamoani tark etish</DialogTitle>
                        <DialogDescription>
                          {team.name} jamoasini tark etishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Bekor qilish</Button>
                        <Button variant="destructive" onClick={handleLeaveTeam}>
                          Tark etish
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
