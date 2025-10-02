"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, Clock, Search, Play } from "lucide-react"
import Link from "next/link"
import { dataStore, type Test } from "@/lib/data-store"
import { useRouter } from "next/navigation"

export function TestsListPage() {
  const router = useRouter()
  const [tests, setTests] = useState<Test[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  useEffect(() => {
    setTests(dataStore.getTests().filter((t) => t.status === "active"))
  }, [])

  const subjects = ["all", ...Array.from(new Set(tests.map((t) => t.subject)))]

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || test.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-blue rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Testlar</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Mavjud testlar</h1>
          <p className="text-xl text-muted-foreground">O'z bilimingizni sinab ko'ring</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Testlarni qidirish..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                onClick={() => setSelectedSubject(subject)}
                className={selectedSubject === subject ? "bg-battle-purple hover:bg-battle-purple/90" : ""}
              >
                {subject === "all" ? "Barchasi" : subject}
              </Button>
            ))}
          </div>
        </div>

        {filteredTests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Testlar topilmadi</h3>
              <p className="text-muted-foreground">Boshqa qidiruv so'rovini sinab ko'ring</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{test.title}</h3>
                        <Badge className="bg-battle-blue/10 text-battle-blue">{test.subject}</Badge>
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
                        <span>Yaratilgan: {new Date(test.createdAt).toLocaleDateString("uz-UZ")}</span>
                      </div>
                    </div>
                    <Link href={`/test/${test.id}`}>
                      <Button className="bg-battle-green hover:bg-battle-green/90">
                        <Play className="w-4 h-4 mr-2" />
                        Boshlash
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
