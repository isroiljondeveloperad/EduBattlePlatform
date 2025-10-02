export interface Test {
  id: string
  title: string
  subject: string
  duration: number
  questions: Question[]
  createdBy: string
  createdAt: string
  status: "active" | "draft"
}

export interface Question {
  question: string
  options: string[]
  correct: number
}

export interface Tournament {
  id: string
  name: string
  description: string
  subject: string
  testId: string
  startDate: string
  duration: number
  maxParticipants: number
  participants: string[]
  status: "upcoming" | "active" | "completed"
  prizePool: number
  prizes: number[]
  leaderboard?: TournamentScore[]
  createdAt: string
  type?: "team" | "1vs1" | "solo"
}

export interface TournamentScore {
  userId: string
  userName: string
  score: number
  correctAnswers: number
  completedAt: string
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
  isPremium: boolean
}

export interface TeamChatMessage {
  id: string
  teamId: string
  userId: string
  userName: string
  message: string
  timestamp: string
}

export interface Team {
  id: string
  name: string
  description: string
  subject: string
  leaderId: string
  leaderName: string
  members: TeamMember[]
  maxMembers: number
  points: number
  createdAt: string
}

export interface TeamMember {
  userId: string
  userName: string
  joinedAt: string
  role: "leader" | "member"
}

export interface UserStats {
  userId: string
  testsCompleted: number
  tournamentsWon: number
  totalPoints: number
  correctAnswers: number
}

export interface Subscription {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  paymentMethod: string
  paymentProof: string
  plan: string
}

export interface Match {
  id: string
  tournamentId: string
  player1Id: string
  player1Name: string
  player2Id: string
  player2Name: string
  player1Score: number
  player2Score: number
  winnerId: string | null
  status: "waiting" | "in_progress" | "completed"
  createdAt: string
  completedAt?: string
}

class DataStore {
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Tests
  getTests(): Test[] {
    return this.getItem("edubattle_tests", [])
  }

  saveTest(test: Test): void {
    const tests = this.getTests()
    const index = tests.findIndex((t) => t.id === test.id)
    if (index >= 0) {
      tests[index] = test
    } else {
      tests.push(test)
    }
    this.setItem("edubattle_tests", tests)
  }

  deleteTest(testId: string): void {
    const tests = this.getTests().filter((t) => t.id !== testId)
    this.setItem("edubattle_tests", tests)
  }

  // Tournaments
  getTournaments(): Tournament[] {
    return this.getItem("edubattle_tournaments", [])
  }

  saveTournament(tournament: Tournament): void {
    const tournaments = this.getTournaments()
    const index = tournaments.findIndex((t) => t.id === tournament.id)
    if (index >= 0) {
      tournaments[index] = tournament
    } else {
      tournaments.push(tournament)
    }
    this.setItem("edubattle_tournaments", tournaments)
  }

  addParticipantToTournament(tournamentId: string, userId: string): boolean {
    const tournaments = this.getTournaments()
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (!tournament) return false

    if (tournament.participants.includes(userId)) return false
    if (tournament.participants.length >= tournament.maxParticipants) return false

    tournament.participants.push(userId)
    this.setItem("edubattle_tournaments", tournaments)
    return true
  }

  submitTournamentScore(
    tournamentId: string,
    userId: string,
    userName: string,
    score: number,
    correctAnswers: number,
  ): void {
    const tournaments = this.getTournaments()
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (!tournament) return

    if (!tournament.leaderboard) {
      tournament.leaderboard = []
    }

    const existingScore = tournament.leaderboard.find((s) => s.userId === userId)
    if (existingScore) {
      existingScore.score = score
      existingScore.correctAnswers = correctAnswers
      existingScore.completedAt = new Date().toISOString()
    } else {
      tournament.leaderboard.push({
        userId,
        userName,
        score,
        correctAnswers,
        completedAt: new Date().toISOString(),
      })
    }

    // Sort leaderboard by score
    tournament.leaderboard.sort((a, b) => b.score - a.score)

    this.setItem("edubattle_tournaments", tournaments)
  }

  getTournamentLeaderboard(tournamentId: string): TournamentScore[] {
    const tournament = this.getTournaments().find((t) => t.id === tournamentId)
    return tournament?.leaderboard || []
  }

  // Chat Messages
  getChatMessages(): ChatMessage[] {
    return this.getItem("edubattle_chat", [])
  }

  saveChatMessage(message: ChatMessage): void {
    const messages = this.getChatMessages()
    messages.push(message)
    this.setItem("edubattle_chat", messages)
  }

  // Team Chat Messages
  getTeamChatMessages(teamId: string): TeamChatMessage[] {
    const allMessages = this.getItem<TeamChatMessage[]>("edubattle_team_chat", [])
    return allMessages.filter((m) => m.teamId === teamId)
  }

  saveTeamChatMessage(message: TeamChatMessage): void {
    const messages = this.getItem<TeamChatMessage[]>("edubattle_team_chat", [])
    messages.push(message)
    this.setItem("edubattle_team_chat", messages)
  }

  // Teams
  getTeams(): Team[] {
    return this.getItem("edubattle_teams", [])
  }

  saveTeam(team: Team): void {
    const teams = this.getTeams()
    const index = teams.findIndex((t) => t.id === team.id)
    if (index >= 0) {
      teams[index] = team
    } else {
      teams.push(team)
    }
    this.setItem("edubattle_teams", teams)
  }

  getTeam(teamId: string): Team | null {
    const teams = this.getTeams()
    return teams.find((t) => t.id === teamId) || null
  }

  joinTeam(teamId: string, userId: string, userName: string): boolean {
    const teams = this.getTeams()
    const team = teams.find((t) => t.id === teamId)
    if (!team) return false

    if (team.members.length >= team.maxMembers) {
      return false
    }

    if (team.members.some((m) => m.userId === userId)) {
      return false
    }

    team.members.push({
      userId,
      userName,
      joinedAt: new Date().toISOString(),
      role: "member",
    })

    this.setItem("edubattle_teams", teams)
    return true
  }

  addUserToTeam(teamId: string, userId: string, userName: string, leaderId: string): boolean {
    const teams = this.getTeams()
    const team = teams.find((t) => t.id === teamId)
    if (!team) return false

    // Check if requester is the leader
    if (team.leaderId !== leaderId) return false

    if (team.members.length >= team.maxMembers) {
      return false
    }

    if (team.members.some((m) => m.userId === userId)) {
      return false
    }

    team.members.push({
      userId,
      userName,
      joinedAt: new Date().toISOString(),
      role: "member",
    })

    this.setItem("edubattle_teams", teams)
    return true
  }

  getAllUsers(): Array<{ id: string; name: string; email?: string }> {
    return this.getItem("edubattle_all_users", [])
  }

  saveUserToAllUsers(user: { id: string; name: string; email?: string }): void {
    const users = this.getAllUsers()
    if (!users.some((u) => u.id === user.id)) {
      users.push(user)
      this.setItem("edubattle_all_users", users)
    }
  }

  getUsersNotInTeams(): Array<{ id: string; name: string; email?: string }> {
    const allUsers = this.getAllUsers()
    const teams = this.getTeams()
    const usersInTeams = new Set<string>()

    teams.forEach((team) => {
      team.members.forEach((member) => {
        usersInTeams.add(member.userId)
      })
    })

    return allUsers.filter((user) => !usersInTeams.has(user.id))
  }

  // User Stats
  getUserStats(userId: string): UserStats {
    const allStats = this.getItem<UserStats[]>("edubattle_user_stats", [])
    const stats = allStats.find((s) => s.userId === userId)
    return (
      stats || {
        userId,
        testsCompleted: 0,
        tournamentsWon: 0,
        totalPoints: 0,
        correctAnswers: 0,
      }
    )
  }

  updateUserStats(stats: UserStats): void {
    const allStats = this.getItem<UserStats[]>("edubattle_user_stats", [])
    const index = allStats.findIndex((s) => s.userId === stats.userId)
    if (index >= 0) {
      allStats[index] = stats
    } else {
      allStats.push(stats)
    }
    this.setItem("edubattle_user_stats", allStats)
  }

  addPoints(userId: string, points: number): void {
    const stats = this.getUserStats(userId)
    stats.totalPoints += points
    this.updateUserStats(stats)
  }

  incrementCorrectAnswers(userId: string, count = 1): void {
    const stats = this.getUserStats(userId)
    stats.correctAnswers += count
    stats.totalPoints += count * 3 // 3 points per correct answer
    this.updateUserStats(stats)
  }

  incrementTestsCompleted(userId: string): void {
    const stats = this.getUserStats(userId)
    stats.testsCompleted += 1
    this.updateUserStats(stats)
  }

  incrementTournamentsWon(userId: string): void {
    const stats = this.getUserStats(userId)
    stats.tournamentsWon += 1
    this.updateUserStats(stats)
  }

  // Subscriptions
  getSubscriptions(): Subscription[] {
    return this.getItem("edubattle_subscriptions", [])
  }

  saveSubscription(subscription: Subscription): void {
    const subscriptions = this.getSubscriptions()
    const index = subscriptions.findIndex((s) => s.id === subscription.id)
    if (index >= 0) {
      subscriptions[index] = subscription
    } else {
      subscriptions.push(subscription)
    }
    this.setItem("edubattle_subscriptions", subscriptions)
  }

  updateSubscriptionStatus(subscriptionId: string, status: "approved" | "rejected"): boolean {
    const subscriptions = this.getSubscriptions()
    const subscription = subscriptions.find((s) => s.id === subscriptionId)
    if (!subscription) return false

    subscription.status = status
    this.setItem("edubattle_subscriptions", subscriptions)

    // If approved, update user's premium status
    if (status === "approved") {
      const storedUser = localStorage.getItem("edubattle_user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.id === subscription.userId) {
          user.isPremium = true
          localStorage.setItem("edubattle_user", JSON.stringify(user))
        }
      }
    }

    return true
  }

  getUserSubscription(userId: string): Subscription | null {
    const subscriptions = this.getSubscriptions()
    return subscriptions.find((s) => s.userId === userId) || null
  }

  getMatches(): Match[] {
    return this.getItem("edubattle_matches", [])
  }

  saveMatch(match: Match): void {
    const matches = this.getMatches()
    const index = matches.findIndex((m) => m.id === match.id)
    if (index >= 0) {
      matches[index] = match
    } else {
      matches.push(match)
    }
    this.setItem("edubattle_matches", matches)
  }

  getTournamentMatches(tournamentId: string): Match[] {
    return this.getMatches().filter((m) => m.tournamentId === tournamentId)
  }

  findOrCreateMatch(tournamentId: string, userId: string, userName: string): Match | null {
    const matches = this.getMatches()

    // Find a waiting match
    const waitingMatch = matches.find(
      (m) => m.tournamentId === tournamentId && m.status === "waiting" && m.player1Id !== userId,
    )

    if (waitingMatch) {
      // Join existing match
      waitingMatch.player2Id = userId
      waitingMatch.player2Name = userName
      waitingMatch.status = "in_progress"
      this.setItem("edubattle_matches", matches)
      return waitingMatch
    }

    // Create new match
    const newMatch: Match = {
      id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tournamentId,
      player1Id: userId,
      player1Name: userName,
      player2Id: "",
      player2Name: "",
      player1Score: 0,
      player2Score: 0,
      winnerId: null,
      status: "waiting",
      createdAt: new Date().toISOString(),
    }

    this.saveMatch(newMatch)
    return newMatch
  }

  submitMatchScore(matchId: string, userId: string, score: number, correctAnswers: number): void {
    const matches = this.getMatches()
    const match = matches.find((m) => m.id === matchId)
    if (!match) return

    if (match.player1Id === userId) {
      match.player1Score = score
    } else if (match.player2Id === userId) {
      match.player2Score = score
    }

    // Check if both players have submitted
    if (match.player1Score > 0 && match.player2Score > 0) {
      match.status = "completed"
      match.completedAt = new Date().toISOString()
      match.winnerId = match.player1Score > match.player2Score ? match.player1Id : match.player2Id

      // Update tournament leaderboard with 1vs1 scoring (7 points per correct answer)
      const pointsEarned = correctAnswers * 7
      this.addPoints(userId, pointsEarned)
    }

    this.setItem("edubattle_matches", matches)
  }
}

export const dataStore = new DataStore()
