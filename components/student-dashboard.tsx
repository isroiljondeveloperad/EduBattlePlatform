"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { dataStore } from "@/lib/data-store"
import { useEffect, useState } from "react"
import Link from "next/link"

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [userStats, setUserStats] = useState({
    testsCompleted: 0,
    tournamentsWon: 0,
    totalPoints: 0,
  })

  useEffect(() => {
    if (user) {
      const stats = dataStore.getUserStats(user.id)
      setUserStats(stats)
    }
  }, [user])

  const userData = {
    name: user?.name || "Student",
    level: 1,
    title: "Knowledge Warrior",
    avatar: "/student-avatar.png",
    isPremium: user?.isPremium || false,
    stats: userStats,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-lg">🏆</div>
              <span className="text-xl font-bold">EduBattle</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/chat">
                <button className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                  💬 {t("nav.chat")}
                </button>
              </Link>

              {userData.isPremium ? (
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  👑 Premium
                </div>
              ) : (
                <Link href="/pricing">
                  <button className="px-3 py-2 text-sm border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-colors">
                    👑 {t("nav.upgrade")}
                  </button>
                </Link>
              )}
              <button
                onClick={logout}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {t("nav.logout")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* User Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              {userData.isPremium && <span className="text-xl">👑</span>}
            </div>
            <p className="text-slate-600">
              {t("dashboard.level")} {userData.level} {userData.title}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{userData.stats.testsCompleted}</div>
              <div className="text-sm text-slate-600">Testlar</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{userData.stats.tournamentsWon}</div>
              <div className="text-sm text-slate-600">G'alabalar</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{userData.stats.totalPoints}</div>
              <div className="text-sm text-slate-600">Ochkolar</div>
            </div>
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        {!userData.isPremium && (
          <div className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">👑</span>
                <div>
                  <h3 className="font-semibold text-lg">{t("premium.unlockFeatures")}</h3>
                  <p className="text-sm text-slate-600">{t("premium.upgradeDescription")}</p>
                </div>
              </div>
              <Link href="/pricing">
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                  {t("premium.upgradeNow")}
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/tests">
            <div className="bg-blue-500 text-white rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="font-semibold text-lg">Testlar</h3>
            </div>
          </Link>

          <Link href="/tournaments">
            <div className="bg-green-500 text-white rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="font-semibold text-lg">{t("dashboard.tournaments")}</h3>
            </div>
          </Link>

          <Link href="/teams">
            <div className="bg-yellow-500 text-white rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="font-semibold text-lg">Jamolar</h3>
            </div>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{t("dashboard.recentActivity")}</h2>
            </div>
            <div className="p-6">
              {userData.stats.testsCompleted === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-slate-600 mb-4">Hali testlar yechilmagan</p>
                  <Link href="/tests">
                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                      Birinchi testni boshlash
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Testlar yechildi</p>
                      <p className="text-sm text-slate-600">{userData.stats.testsCompleted} ta test</p>
                    </div>
                    <span className="text-3xl">📝</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Jami ochkolar</p>
                      <p className="text-sm text-slate-600">{userData.stats.totalPoints} ochko</p>
                    </div>
                    <span className="text-3xl">🏆</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* My Teams */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t("dashboard.myTeams")}</h2>
                <Link href="/teams">
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors">
                    ➕ {t("dashboard.createTeam")}
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-slate-600 mb-4">{t("dashboard.noTeams")}</p>
                <Link href="/teams">
                  <button className="px-6 py-3 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-medium rounded-lg transition-colors">
                    {t("dashboard.browseTeams")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
