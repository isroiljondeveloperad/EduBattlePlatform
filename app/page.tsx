"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const { login } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const handleGoogleLogin = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-2xl">🏆</div>
          <span className="text-2xl font-bold text-slate-900">EduBattle</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === "en" ? "uz" : "en")}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            🌐 {language === "en" ? "O'zbek" : "English"}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-balance">
                {t("login.levelUp")}{" "}
                <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                  {t("login.learning")}
                </span>
              </h1>
              <p className="text-xl text-slate-600 text-pretty">{t("login.heroDescription")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">10,000+</div>
                <div className="text-sm text-slate-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">5,000+</div>
                <div className="text-sm text-slate-600">Battles Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">250+</div>
                <div className="text-sm text-slate-600">Tournaments</div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🏆</div>
                <span className="text-sm font-medium">{t("dashboard.tournaments")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">👥</div>
                <span className="text-sm font-medium">Team Battles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">⚡</div>
                <span className="text-sm font-medium">Live Chat</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🎯</div>
                <span className="text-sm font-medium">Progress Tracking</span>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200">
              <div className="p-6 text-center border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">{t("login.title")}</h2>
                <p className="text-sm text-slate-600 mt-1">{t("login.description")}</p>
              </div>
              <div className="p-6 space-y-4">
                {/* Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setActiveTab("student")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "student"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    O'quvchi
                  </button>
                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "admin"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Admin
                  </button>
                </div>

                {/* Student Tab */}
                {activeTab === "student" && (
                  <div className="space-y-4 mt-4">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">yoki</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="student-email" className="block text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <input
                        id="student-email"
                        type="email"
                        placeholder="email@example.com"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="student-password" className="block text-sm font-medium text-slate-700">
                        Parol
                      </label>
                      <input
                        id="student-password"
                        type="password"
                        placeholder="Parolni kiriting"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleStudentLogin}
                      className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Kirish
                    </button>

                    <div className="text-center text-xs text-slate-500">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </div>
                  </div>
                )}

                {/* Admin Tab */}
                {activeTab === "admin" && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                        {t("login.username")}
                      </label>
                      <input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        {t("login.password")}
                      </label>
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleAdminLogin}
                      className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {t("login.loginAsAdmin")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
