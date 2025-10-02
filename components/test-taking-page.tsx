"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { dataStore, type Test } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface TestTakingPageProps {
  testId: string
}

export function TestTakingPage({ testId }: TestTakingPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [test, setTest] = useState<Test | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const loadedTest = dataStore.getTests().find((t) => t.id === testId)
    if (loadedTest) {
      setTest(loadedTest)
      setTimeLeft(loadedTest.duration * 60)
      setAnswers(new Array(loadedTest.questions.length).fill(-1))
    }
  }, [testId])

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isFinished) {
      handleFinishTest()
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

  const handleFinishTest = () => {
    if (!test || !user) return

    let correctCount = 0
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++
      }
    })

    const finalScore = (correctCount / test.questions.length) * 100
    setScore(finalScore)
    setIsFinished(true)

    // Update user stats
    dataStore.incrementTestsCompleted(user.id)
    dataStore.incrementCorrectAnswers(user.id, correctCount)

    toast({
      title: "Test yakunlandi!",
      description: `Siz ${correctCount}/${test.questions.length} ta to'g'ri javob berdingiz`,
    })
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Test topilmadi</h2>
            <Link href="/dashboard">
              <Button>Boshqaruvga qaytish</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isFinished) {
    const correctCount = test.questions.filter((q, i) => answers[i] === q.correct).length
    const pointsEarned = correctCount * 3

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Boshqaruvga qaytish
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-battle-green/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-battle-green" />
              </div>
              <CardTitle className="text-3xl">Test yakunlandi!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-battle-purple mb-2">{score.toFixed(0)}%</div>
                <p className="text-muted-foreground">Sizning natijangiz</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-battle-green">{correctCount}</div>
                  <div className="text-sm text-muted-foreground">To'g'ri javoblar</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-red-500">{test.questions.length - correctCount}</div>
                  <div className="text-sm text-muted-foreground">Noto'g'ri javoblar</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-battle-yellow">{pointsEarned}</div>
                  <div className="text-sm text-muted-foreground">Ochkolar</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Javoblar tahlili:</h3>
                {test.questions.map((question, index) => {
                  const isCorrect = answers[index] === question.correct
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            {index + 1}. {question.question}
                          </p>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              Sizning javobingiz:{" "}
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {answers[index] >= 0 ? question.options[answers[index]] : "Javob berilmagan"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-muted-foreground">
                                To'g'ri javob:{" "}
                                <span className="text-green-600">{question.options[question.correct]}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full bg-transparent" variant="outline">
                    Boshqaruvga qaytish
                  </Button>
                </Link>
                <Link href="/tests" className="flex-1">
                  <Button className="w-full bg-battle-purple hover:bg-battle-purple/90">Boshqa testlar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
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
              <h1 className="text-xl font-bold">{test.title}</h1>
              <Badge variant="outline">{test.subject}</Badge>
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
                  <Button onClick={handleFinishTest} className="bg-battle-green hover:bg-battle-green/90">
                    Testni yakunlash
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

        {/* Question Navigator */}
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
