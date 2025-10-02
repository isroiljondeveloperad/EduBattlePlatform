"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { dataStore, type Test, type Tournament } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface TournamentCompetePageProps {
  tournamentId: string
}

export function TournamentCompetePage({ tournamentId }: TournamentCompetePageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [test, setTest] = useState<Test | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const loadedTournament = dataStore.getTournaments().find((t) => t.id === tournamentId)
    if (loadedTournament) {
      setTournament(loadedTournament)
      const loadedTest = dataStore.getTests().find((t) => t.id === loadedTournament.testId)
      if (loadedTest) {
        setTest(loadedTest)
        setTimeLeft(loadedTournament.duration * 60)
        setAnswers(new Array(loadedTest.questions.length).fill(-1))
      }
    }
  }, [tournamentId])

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isFinished) {
      handleFinishTournament()
    }
  }, [timeLeft, isFinished])

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

  const handleFinishTournament = () => {
    if (!test || !user || !tournament) return

    let correctCount = 0
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++
      }
    })

    const finalScore = (correctCount / test.questions.length) * 100

    // Submit score to tournament leaderboard
    dataStore.submitTournamentScore(tournamentId, user.id, user.name, finalScore, correctCount)

    // Update user stats
    const pointsEarned = correctCount * 3
    dataStore.addPoints(user.id, pointsEarned)
    dataStore.incrementTestsCompleted(user.id)

    setIsFinished(true)

    toast({
      title: "Turnir yakunlandi!",
      description: `Siz ${correctCount}/${test.questions.length} ta to'g'ri javob berdingiz`,
    })

    // Redirect to results after 2 seconds
    setTimeout(() => {
      router.push(`/tournament/${tournamentId}/results`)
    }, 2000)
  }

  if (!tournament || !test) {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="w-6 h-6 text-battle-green" />
              <div>
                <h1 className="text-xl font-bold">{tournament.name}</h1>
                <p className="text-sm text-muted-foreground">{test.title}</p>
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
            <CardTitle className="text-2xl">Savol {currentQuestion + 1}</CardTitle>
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
                  <Button onClick={handleFinishTournament} className="bg-battle-green hover:bg-battle-green/90">
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
