"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trophy, Users, Calendar, Play, Pause, Square, Swords } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { SUBJECTS } from "@/lib/subjects"

interface Tournament {
  id: string
  name: string
  description: string
  subject_id: string
  subject_name?: string
  tournament_type: "team" | "1vs1"
  max_participants: number
  start_date: string
  end_date: string
  status: "upcoming" | "active" | "completed" | "cancelled"
  prize_description: string
  created_at: string
  participant_count?: number
}

export function TournamentManagement() {
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [newTournament, setNewTournament] = useState({
    name: "",
    description: "",
    subjectId: "",
    tournamentType: "1vs1" as "1vs1" | "team",
    prizeDescription: "",
    startDate: "",
    endDate: "",
    maxParticipants: 100,
  })

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = () => {
    try {
      const stored = localStorage.getItem("tournaments")
      if (stored) {
        const data = JSON.parse(stored) as Tournament[]
        setTournaments(data)
      } else {
        // Add demo tournaments
        const demoTournaments: Tournament[] = [
          {
            id: "1",
            name: "Matematika Chempionati 2024",
            description: "Yilning eng katta matematika turniri",
            subject_id: "matematika",
            subject_name: "Matematika",
            tournament_type: "1vs1",
            max_participants: 100,
            start_date: new Date(Date.now() + 86400000).toISOString(),
            end_date: new Date(Date.now() + 604800000).toISOString(),
            status: "upcoming",
            prize_description: "500,000 so'm va sertifikat",
            created_at: new Date().toISOString(),
            participant_count: 45,
          },
          {
            id: "2",
            name: "Fizika Olimpiadasi",
            description: "Jamoaviy fizika musobaqasi",
            subject_id: "fizika",
            subject_name: "Fizika",
            tournament_type: "team",
            max_participants: 50,
            start_date: new Date(Date.now() - 86400000).toISOString(),
            end_date: new Date(Date.now() + 259200000).toISOString(),
            status: "active",
            prize_description: "1,000,000 so'm va kubok",
            created_at: new Date().toISOString(),
            participant_count: 32,
          },
        ]
        setTournaments(demoTournaments)
        localStorage.setItem("tournaments", JSON.stringify(demoTournaments))
      }
    } catch (error) {
      console.error("[v0] Error fetching tournaments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTournament = () => {
    if (!newTournament.name || !newTournament.subjectId || !newTournament.startDate || !newTournament.endDate) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    try {
      const subject = newTournament.subjectId
      const tournament: Tournament = {
        id: Date.now().toString(),
        name: newTournament.name,
        description: newTournament.description,
        subject_id: newTournament.subjectId,
        subject_name: subject,
        tournament_type: newTournament.tournamentType,
        max_participants: newTournament.maxParticipants,
        start_date: newTournament.startDate,
        end_date: newTournament.endDate,
        prize_description: newTournament.prizeDescription,
        status: "upcoming",
        created_at: new Date().toISOString(),
        participant_count: 0,
      }

      const updatedTournaments = [...tournaments, tournament]
      setTournaments(updatedTournaments)
      localStorage.setItem("tournaments", JSON.stringify(updatedTournaments))

      toast({
        title: "Muvaffaqiyatli!",
        description: "Turnir yaratildi",
      })

      setIsCreateDialogOpen(false)
      setNewTournament({
        name: "",
        description: "",
        subjectId: "",
        tournamentType: "1vs1",
        prizeDescription: "",
        startDate: "",
        endDate: "",
        maxParticipants: 100,
      })
    } catch (error) {
      console.error("[v0] Error creating tournament:", error)
      toast({
        title: "Xatolik",
        description: "Turnir yaratishda xatolik",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = (tournamentId: string, newStatus: string) => {
    try {
      const updatedTournaments = tournaments.map((t) =>
        t.id === tournamentId ? { ...t, status: newStatus as Tournament["status"] } : t,
      )
      setTournaments(updatedTournaments)
      localStorage.setItem("tournaments", JSON.stringify(updatedTournaments))

      toast({
        title: "Yangilandi",
        description: "Turnir holati o'zgartirildi",
      })
    } catch (error) {
      console.error("[v0] Error updating tournament:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-battle-green"
      case "upcoming":
        return "bg-battle-blue"
      case "completed":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />
      case "upcoming":
        return <Calendar className="w-4 h-4" />
      case "completed":
        return <Square className="w-4 h-4" />
      default:
        return <Pause className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Faol"
      case "upcoming":
        return "Kutilmoqda"
      case "completed":
        return "Tugagan"
      case "cancelled":
        return "Bekor qilingan"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Adminpanelga qaytish
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-green rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Turnir Boshqaruvi</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Turnir Boshqaruvi</h1>
            <p className="text-muted-foreground">Barcha fanlar uchun turnirlar yarating va boshqaring</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-battle-green hover:bg-battle-green/90">
                <Plus className="w-4 h-4 mr-2" />
                Yangi Turnir
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yangi Turnir Yaratish</DialogTitle>
                <DialogDescription>O'quvchilar uchun yangi turnir tashkil qiling</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Turnir Nomi</Label>
                  <Input
                    id="name"
                    value={newTournament.name}
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                    placeholder="masalan, Matematika Chempionati 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif</Label>
                  <Textarea
                    id="description"
                    value={newTournament.description}
                    onChange={(e) => setNewTournament({ ...newTournament, description: e.target.value })}
                    placeholder="Turnir haqida ma'lumot..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Fan</Label>
                    <Select
                      value={newTournament.subjectId}
                      onValueChange={(value) => setNewTournament({ ...newTournament, subjectId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fanni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Turnir Turi</Label>
                    <RadioGroup
                      value={newTournament.tournamentType}
                      onValueChange={(value: "1vs1" | "team") =>
                        setNewTournament({ ...newTournament, tournamentType: value })
                      }
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="1vs1" id="1vs1" />
                        <Label htmlFor="1vs1" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Swords className="w-4 h-4" />1 vs 1
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="team" id="team" />
                        <Label htmlFor="team" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Jamoaviy
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Boshlanish Sanasi</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={newTournament.startDate}
                      onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tugash Sanasi</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={newTournament.endDate}
                      onChange={(e) => setNewTournament({ ...newTournament, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Maksimal Ishtirokchilar</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newTournament.maxParticipants}
                    onChange={(e) =>
                      setNewTournament({ ...newTournament, maxParticipants: Number.parseInt(e.target.value) })
                    }
                    min="10"
                    max="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prize">Mukofot Tavsifi</Label>
                  <Input
                    id="prize"
                    value={newTournament.prizeDescription}
                    onChange={(e) => setNewTournament({ ...newTournament, prizeDescription: e.target.value })}
                    placeholder="masalan, 500,000 so'm va sertifikat"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button className="bg-battle-green hover:bg-battle-green/90" onClick={handleCreateTournament}>
                    Turnir Yaratish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tournament Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faol Turnirlar</p>
                  <p className="text-2xl font-bold text-battle-green">
                    {tournaments.filter((t) => t.status === "active").length}
                  </p>
                </div>
                <Play className="w-8 h-8 text-battle-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kutilayotgan</p>
                  <p className="text-2xl font-bold text-battle-blue">
                    {tournaments.filter((t) => t.status === "upcoming").length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-battle-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jami Ishtirokchilar</p>
                  <p className="text-2xl font-bold text-battle-purple">
                    {tournaments.reduce((sum, t) => sum + (t.participant_count || 0), 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-battle-purple" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jami Turnirlar</p>
                  <p className="text-2xl font-bold">{tournaments.length}</p>
                </div>
                <Trophy className="w-8 h-8 text-battle-yellow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournaments List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Yuklanmoqda...</p>
              </CardContent>
            </Card>
          ) : tournaments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hali turnirlar yo'q</h3>
                <p className="text-muted-foreground">Birinchi turniringizni yarating</p>
              </CardContent>
            </Card>
          ) : (
            tournaments.map((tournament) => (
              <Card key={tournament.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{tournament.name}</h3>
                        <Badge className={getStatusColor(tournament.status)}>
                          {getStatusIcon(tournament.status)}
                          <span className="ml-1">{getStatusText(tournament.status)}</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {tournament.tournament_type === "1vs1" ? (
                            <Swords className="w-3 h-3" />
                          ) : (
                            <Users className="w-3 h-3" />
                          )}
                          {tournament.tournament_type === "1vs1" ? "1 vs 1" : "Jamoaviy"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Fan:</span> {tournament.subject_name}
                        </div>
                        <div>
                          <span className="font-medium">Ishtirokchilar:</span> {tournament.participant_count}/
                          {tournament.max_participants}
                        </div>
                        <div>
                          <span className="font-medium">Mukofot:</span>{" "}
                          {tournament.prize_description || "Belgilanmagan"}
                        </div>
                        <div>
                          <span className="font-medium">Boshlanish:</span>{" "}
                          {new Date(tournament.start_date).toLocaleDateString("uz-UZ")}
                        </div>
                        <div>
                          <span className="font-medium">Tugash:</span>{" "}
                          {new Date(tournament.end_date).toLocaleDateString("uz-UZ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {tournament.status === "upcoming" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-battle-green hover:text-battle-green/90 bg-transparent"
                          onClick={() => handleUpdateStatus(tournament.id, "active")}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Boshlash
                        </Button>
                      )}
                      {tournament.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleUpdateStatus(tournament.id, "completed")}
                        >
                          <Square className="w-4 h-4 mr-1" />
                          Tugatish
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
