"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Trophy, Swords, Zap, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { dataStore, type Test, type Tournament, type Match } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface TournamentBattlePageProps {
  tournamentId: string
}

export function TournamentBattlePage({ tournamentId }: TournamentBattlePageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [test, setTest] = useState<Test | null>(null)
  const [match, setMatch] = useState<Match | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    const loadedTournament = dataStore.getTournaments().find((t) => t.id === tournamentId)
    if (loadedTournament) {
      setTournament(loadedTournament)
      const loadedTest = dataStore.getTests().find((t) => t.id === loadedTournament.testId)
      if (loadedTest) {
        setTest(loadedTest)
        setTimeLeft(loadedTournament.duration * 60)
        setAnswers(new Array(loadedTest.questions.length).fill(-1))

        // Find or create match
        const foundMatch = dataStore.findOrCreateMatch(tournamentId, user.id, user.name)
        if (foundMatch) {
          setMatch(foundMatch)
          if (foundMatch.status === "in_progress") {
            setIsWaitingForOpponent(false)
          }
        }
      }
    }
  }, [tournamentId, user, router])

  // Poll for opponent
  useEffect(() => {
    if (!isWaitingForOpponent || !match) return

    const interval = setInterval(() => {
      const matches = dataStore.getMatches()
      const updatedMatch = matches.find((m) => m.id === match.id)
      if (updatedMatch && updatedMatch.status === "in_progress") {
        setMatch(updatedMatch)
        setIsWaitingForOpponent(false)
        toast({
          title: "Raqib topildi!",
          description: `${updatedMatch.player2Name} bilan jang boshlandi!`,
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isWaitingForOpponent, match, toast])

  useEffect(() => {
    if (timeLeft > 0 && !isFinished && !isWaitingForOpponent) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isFinished && !isWaitingForOpponent) {
      handleFinishBattle()
    }
  }, [timeLeft, isFinished, isWaitingForOpponent])

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (test && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleFinishBattle = () => {
    if (!test || !user || !tournament || !match) return

    let correctCount = 0
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++
      }
    })

    const finalScore = (correctCount / test.questions.length) * 100

    // Submit match score
    dataStore.submitMatchScore(match.id, user.id, finalScore, correctCount)

    // Submit to tournament leaderboard
    dataStore.submitTournamentScore(tournamentId, user.id, user.name, finalScore, correctCount)

    // Update user stats
    dataStore.incrementTestsCompleted(user.id)

    setIsFinished(true)

    toast({
      title: "Jang yakunlandi!",
      description: `Siz ${correctCount}/${test.questions.length} ta to'g'ri javob berdingiz`,
    })

    // Redirect to results after 2 seconds
    setTimeout(() => {
      router.push(`/tournament/${tournamentId}/battle/${match.id}/results`)
    }, 2000)
  }

  if (!tournament || !test || !match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Yuklanmoqda...</h2>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isWaitingForOpponent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <Swords className="w-20 h-20 text-battle-purple animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Raqib izlanmoqda...</h2>
            <p className="text-muted-foreground mb-6">Sizga mos raqib topilmoqda. Iltimos kuting.</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-battle-purple rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div
                className="w-3 h-3 bg-battle-purple rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-3 h-3 bg-battle-purple rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <Trophy className="w-20 h-20 mx-auto text-battle-green mb-4" />
            <h2 className="text-2xl font-bold mb-4">Javoblaringiz yuborildi!</h2>
            <p className="text-muted-foreground mb-4">Natijalarga yo'naltirilmoqda...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = test.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / test.questions.length) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const opponent = match.player1Id === user.id ? match.player2Name : match.player1Name

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Swords className="w-6 h-6 text-battle-purple" />
              <div>
                <h1 className="text-xl font-bold">1vs1 Jang</h1>
                <p className="text-sm text-muted-foreground">{tournament.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-battle-blue text-white text-xs">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">{user.name}</span>
              </div>
              <Badge variant="outline" className="bg-battle-purple/10 text-battle-purple">
                <Swords className="w-3 h-3 mr-1" />
                VS
              </Badge>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">{opponent}</span>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-battle-green text-white text-xs">{opponent.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-battle-blue" />
                <span className={`font-mono font-bold ${timeLeft < 60 ? "text-red-500" : ""}`}>
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </span>
              </div>
              <Badge>
                {currentQuestion + 1} / {test.questions.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6 text-battle-purple" />
              Savol {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{question.question}</p>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? "border-battle-purple bg-battle-purple/10"
                      : "border-border hover:border-battle-purple/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        answers[currentQuestion] === index
                          ? "border-battle-purple bg-battle-purple text-white"
                          : "border-border"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Oldingi
              </Button>
              <div className="flex gap-2">
                {currentQuestion === test.questions.length - 1 ? (
                  <Button onClick={handleFinishBattle} className="bg-battle-green hover:bg-battle-green/90">
                    <Zap className="w-4 h-4 mr-2" />
                    Yakunlash
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-battle-purple hover:bg-battle-purple/90">
                    Keyingi
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Savollar navigatsiyasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {test.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`aspect-square rounded-lg border-2 font-bold text-sm transition-all ${
                    index === currentQuestion
                      ? "border-battle-purple bg-battle-purple text-white"
                      : answers[index] >= 0
                        ? "border-battle-green bg-battle-green/10 text-battle-green"
                        : "border-border hover:border-battle-purple/50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
