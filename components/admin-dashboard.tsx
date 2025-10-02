"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, FileText, BarChart3, Plus, Crown, Shirt, Clock, Bell } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { dataStore } from "@/lib/data-store"

export function AdminDashboard() {
  const { logout } = useAuth()
  const [stats, setStats] = useState({
    totalTests: 0,
    totalTournaments: 0,
    totalTeams: 0,
    totalUsers: 0,
    pendingSubscriptions: 0,
  })

  useEffect(() => {
    const tests = dataStore.getTests()
    const tournaments = dataStore.getTournaments()
    const teams = dataStore.getTeams()
    const subscriptions = dataStore.getSubscriptions()
    const allUserStats = JSON.parse(localStorage.getItem("edubattle_user_stats") || "[]")

    setStats({
      totalTests: tests.length,
      totalTournaments: tournaments.length,
      totalTeams: teams.length,
      totalUsers: allUserStats.length,
      pendingSubscriptions: subscriptions.filter((s) => s.status === "pending").length,
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-purple rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EduBattle Admin</span>
            </div>
            <div className="flex items-center gap-4">
              {stats.pendingSubscriptions > 0 && (
                <Link href="/admin/subscriptions">
                  <Button variant="outline" size="sm" className="relative bg-transparent">
                    <Bell className="w-4 h-4 mr-2" />
                    Pending Approvals
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5">
                      {stats.pendingSubscriptions}
                    </Badge>
                  </Button>
                </Link>
              )}
              <Badge variant="secondary" className="bg-battle-purple/10 text-battle-purple">
                <Crown className="w-3 h-3 mr-1" />
                Administrator
              </Badge>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {stats.pendingSubscriptions > 0 && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">
                      {stats.pendingSubscriptions} Premium Subscription
                      {stats.pendingSubscriptions > 1 ? "s" : ""} Awaiting Approval
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Review and approve premium subscription requests to activate user benefits.
                    </p>
                  </div>
                </div>
                <Link href="/admin/subscriptions">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Review Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-battle-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tournaments</p>
                  <p className="text-2xl font-bold">{stats.totalTournaments}</p>
                </div>
                <Trophy className="w-8 h-8 text-battle-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold">{stats.totalTests}</p>
                </div>
                <FileText className="w-8 h-8 text-battle-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Teams</p>
                  <p className="text-2xl font-bold">{stats.totalTeams}</p>
                </div>
                <Users className="w-8 h-8 text-battle-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Link href="/admin/tests">
            <Card className="cursor-pointer hover:scale-105 transition-transform bg-battle-purple/5 border-battle-purple/20">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-battle-purple" />
                <h3 className="font-semibold text-battle-purple">Manage Tests</h3>
                <p className="text-sm text-muted-foreground mt-1">Create and edit tests</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/tournaments">
            <Card className="cursor-pointer hover:scale-105 transition-transform bg-battle-green/5 border-battle-green/20">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-battle-green" />
                <h3 className="font-semibold text-battle-green">Tournaments</h3>
                <p className="text-sm text-muted-foreground mt-1">Create competitions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/subscriptions">
            <Card className="cursor-pointer hover:scale-105 transition-transform bg-orange-50 border-orange-200 relative">
              <CardContent className="p-6 text-center">
                <Crown className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold text-orange-600">Subscriptions</h3>
                <p className="text-sm text-muted-foreground mt-1">Approve premium plans</p>
                {stats.pendingSubscriptions > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5">
                    {stats.pendingSubscriptions}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/progress">
            <Card className="cursor-pointer hover:scale-105 transition-transform bg-battle-blue/5 border-battle-blue/20">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-battle-blue" />
                <h3 className="font-semibold text-battle-blue">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground mt-1">Monitor students</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:scale-105 transition-transform bg-battle-yellow/5 border-battle-yellow/20">
            <CardContent className="p-6 text-center">
              <Shirt className="w-8 h-8 mx-auto mb-2 text-battle-yellow" />
              <h3 className="font-semibold text-battle-yellow">Store Items</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage merchandise</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Key metrics overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Users</span>
                      <span className="font-semibold">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Tests</span>
                      <span className="font-semibold">{stats.totalTests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Tournaments</span>
                      <span className="font-semibold">{stats.totalTournaments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Teams</span>
                      <span className="font-semibold">{stats.totalTeams}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/admin/tests">
                    <Button className="w-full bg-battle-purple hover:bg-battle-purple/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Test
                    </Button>
                  </Link>
                  <Link href="/admin/tournaments">
                    <Button className="w-full bg-battle-green hover:bg-battle-green/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Tournament
                    </Button>
                  </Link>
                  <Link href="/admin/progress">
                    <Button className="w-full bg-battle-blue hover:bg-battle-blue/90">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Progress Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Test Management</h2>
                <p className="text-muted-foreground">Quick overview of your tests</p>
              </div>
              <Link href="/admin/tests">
                <Button className="bg-battle-purple hover:bg-battle-purple/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Tests
                </Button>
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-purple mb-2">{stats.totalTests}</div>
                  <p className="text-sm text-muted-foreground">All tests in the system</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-green mb-2">
                    {dataStore.getTests().filter((t) => t.status === "active").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Currently available</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Draft Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-yellow mb-2">
                    {dataStore.getTests().filter((t) => t.status === "draft").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Being prepared</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Tournament Overview</h2>
                <p className="text-muted-foreground">Manage competitions and events</p>
              </div>
              <Link href="/admin/tournaments">
                <Button className="bg-battle-green hover:bg-battle-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Tournaments
                </Button>
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Tournaments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-green mb-2">{stats.totalTournaments}</div>
                  <p className="text-sm text-muted-foreground">All tournaments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-blue mb-2">
                    {dataStore.getTournaments().filter((t) => t.status === "active").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Currently running</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-purple mb-2">
                    {dataStore.getTournaments().filter((t) => t.status === "upcoming").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Starting soon</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Team Management</h2>
              <p className="text-muted-foreground">Overview of all teams</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-yellow mb-2">{stats.totalTeams}</div>
                  <p className="text-sm text-muted-foreground">All teams created</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-blue mb-2">
                    {dataStore.getTeams().reduce((sum, team) => sum + team.members.length, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Across all teams</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-battle-green mb-2">
                    {stats.totalTeams > 0
                      ? Math.round(
                          dataStore.getTeams().reduce((sum, team) => sum + team.members.length, 0) / stats.totalTeams,
                        )
                      : 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Members per team</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Track platform performance and user engagement</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Detailed analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
