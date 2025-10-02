"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { dataStore, type Test } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { SUBJECTS } from "@/lib/subjects"

export function TestManagement() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [tests, setTests] = useState<Test[]>([])
  const [newTest, setNewTest] = useState({
    title: "",
    subject: "",
    duration: 10,
    questions: Array(1)
      .fill(null)
      .map(() => ({ question: "", options: ["", "", "", ""], correct: 0 })),
  })

  useEffect(() => {
    setTests(dataStore.getTests())
  }, [])

  const addQuestion = () => {
    if (newTest.questions.length < 25) {
      setNewTest({
        ...newTest,
        questions: [...newTest.questions, { question: "", options: ["", "", "", ""], correct: 0 }],
      })
    }
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...newTest.questions]
    if (field === "options") {
      updatedQuestions[index].options = value
    } else {
      updatedQuestions[index][field] = value
    }
    setNewTest({ ...newTest, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    if (newTest.questions.length > 1) {
      const updatedQuestions = newTest.questions.filter((_, i) => i !== index)
      setNewTest({ ...newTest, questions: updatedQuestions })
    }
  }

  const handleSaveTest = () => {
    if (!newTest.title || !newTest.subject) {
      toast({
        title: "Xatolik",
        description: "Test nomi va fanni to'ldiring",
        variant: "destructive",
      })
      return
    }

    const hasEmptyQuestions = newTest.questions.some((q) => !q.question || q.options.some((opt) => !opt))

    if (hasEmptyQuestions) {
      toast({
        title: "Xatolik",
        description: "Barcha savollar va javoblarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    const test: Test = {
      id: Date.now().toString(),
      title: newTest.title,
      subject: newTest.subject,
      duration: newTest.duration,
      questions: newTest.questions,
      createdBy: user?.id || "admin",
      createdAt: new Date().toISOString(),
      status: "active",
    }

    dataStore.saveTest(test)
    setTests(dataStore.getTests())
    setIsCreateDialogOpen(false)
    setNewTest({
      title: "",
      subject: "",
      duration: 10,
      questions: Array(1)
        .fill(null)
        .map(() => ({ question: "", options: ["", "", "", ""], correct: 0 })),
    })

    toast({
      title: "Muvaffaqiyatli!",
      description: "Test saqlandi",
    })
  }

  const handleDeleteTest = (testId: string) => {
    dataStore.deleteTest(testId)
    setTests(dataStore.getTests())
    toast({
      title: "O'chirildi",
      description: "Test o'chirildi",
    })
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
              <div className="w-8 h-8 bg-battle-purple rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Test boshqaruvi</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Test boshqaruvi</h1>
            <p className="text-muted-foreground">Barcha fanlar uchun testlar yarating va boshqaring</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-battle-purple hover:bg-battle-purple/90">
                <Plus className="w-4 h-4 mr-2" />
                Yangi test yaratish
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yangi test yaratish</DialogTitle>
                <DialogDescription>Savollar va javoblar bilan yangi test qo'shing</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Test Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Test nomi</Label>
                    <Input
                      id="title"
                      value={newTest.title}
                      onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                      placeholder="masalan, Matematika - Algebra asoslari"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Fan</Label>
                    <Select
                      value={newTest.subject}
                      onValueChange={(value) => setNewTest({ ...newTest, subject: value })}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Davomiyligi (daqiqa)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newTest.duration}
                    onChange={(e) => setNewTest({ ...newTest, duration: Number.parseInt(e.target.value) })}
                    min="5"
                    max="60"
                  />
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Savollar (maksimal 25 ta)</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={addQuestion}
                        variant="outline"
                        size="sm"
                        disabled={newTest.questions.length >= 25}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Savol qo'shish
                      </Button>
                      <Badge variant="outline">{newTest.questions.length}/25</Badge>
                    </div>
                  </div>

                  {newTest.questions.map((q, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Savol {index + 1}</CardTitle>
                          {newTest.questions.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Savol matni</Label>
                          <Textarea
                            value={q.question}
                            onChange={(e) => updateQuestion(index, "question", e.target.value)}
                            placeholder="Savolingizni shu yerga yozing..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Javob variantlari</Label>
                          {q.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...q.options]
                                  newOptions[optionIndex] = e.target.value
                                  updateQuestion(index, "options", newOptions)
                                }}
                                placeholder={`Variant ${String.fromCharCode(65 + optionIndex)}`}
                              />
                              <Button
                                variant={q.correct === optionIndex ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateQuestion(index, "correct", optionIndex)}
                                className={q.correct === optionIndex ? "bg-battle-green hover:bg-battle-green/90" : ""}
                              >
                                {q.correct === optionIndex ? "To'g'ri" : "To'g'ri deb belgilash"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button className="bg-battle-purple hover:bg-battle-purple/90" onClick={handleSaveTest}>
                    Testni saqlash
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          {tests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hali testlar yo'q</h3>
                <p className="text-muted-foreground">Birinchi testingizni yarating</p>
              </CardContent>
            </Card>
          ) : (
            tests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{test.title}</h3>
                        <Badge
                          variant={test.status === "active" ? "default" : "secondary"}
                          className={test.status === "active" ? "bg-battle-green" : ""}
                        >
                          {test.status === "active" ? "faol" : "qoralama"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {test.questions.length} ta savol
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.duration} daqiqa
                        </span>
                        <span>Fan: {test.subject}</span>
                        <span>Yaratilgan: {new Date(test.createdAt).toLocaleDateString("uz-UZ")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteTest(test.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        O'chirish
                      </Button>
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
