"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Zap, Users, Target, Globe } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

export function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const { login } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked")
    // For demo, create student user and login
    const studentUser = {
      id: "student_1",
      name: "Xojakbar Abdullajanov",
      email: "student@example.com",
      role: "student" as const,
      isPremium: false,
    }
    login(studentUser)
    window.location.href = "/dashboard"
  }

  const handleStudentLogin = () => {
    if (studentEmail && studentPassword) {
      const studentUser = {
        id: `student_${Date.now()}`,
        name: studentEmail.split("@")[0],
        email: studentEmail,
        role: "student" as const,
        isPremium: false,
      }
      login(studentUser)
      window.location.href = "/dashboard"
    } else {
      alert("Iltimos, email va parolni kiriting")
    }
  }

  const handleAdminLogin = () => {
    if (username === "admin" && password === "admin123") {
      const adminUser = {
        id: "admin_1",
        name: "Administrator",
        email: "admin@edubattle.com",
        role: "admin" as const,
      }
      login(adminUser)
      window.location.href = "/admin"
    } else {
      alert("Noto'g'ri admin ma'lumotlari")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-battle-purple rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">EduBattle</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "uz" : "en")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Globe className="w-4 h-4 mr-1" />
            {language === "en" ? "O'zbek" : "English"}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-balance">
                {t("login.levelUp")}{" "}
                <span className="text-transparent bg-gradient-to-r from-battle-purple to-battle-blue bg-clip-text">
                  {t("login.learning")}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">{t("login.heroDescription")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-battle-yellow">10,000+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-battle-green">5,000+</div>
                <div className="text-sm text-muted-foreground">Battles Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-battle-blue">250+</div>
                <div className="text-sm text-muted-foreground">Tournaments</div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-battle-purple/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-battle-purple" />
                </div>
                <span className="text-sm font-medium">{t("dashboard.tournaments")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-battle-yellow/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-battle-yellow" />
                </div>
                <span className="text-sm font-medium">Team Battles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-battle-green/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-battle-green" />
                </div>
                <span className="text-sm font-medium">Live Chat</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-battle-blue/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-battle-blue" />
                </div>
                <span className="text-sm font-medium">Progress Tracking</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
                <CardDescription>{t("login.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="student" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">O'quvchi</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>

                  <TabsContent value="student" className="space-y-4 mt-4">
                    <Button
                      onClick={handleGoogleLogin}
                      className="w-full bg-battle-purple hover:bg-battle-purple/90"
                      size="lg"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {t("login.continueWithGoogle")}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">yoki</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-email">Email</Label>
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="email@example.com"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Parol</Label>
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Parolni kiriting"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleStudentLogin} className="w-full bg-battle-green hover:bg-battle-green/90">
                      Kirish
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </div>
                  </TabsContent>

                  <TabsContent value="admin" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">{t("login.username")}</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t("login.password")}</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAdminLogin} className="w-full bg-battle-purple hover:bg-battle-purple/90">
                      {t("login.loginAsAdmin")}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
