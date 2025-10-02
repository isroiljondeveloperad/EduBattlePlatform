// Scoring system for EduBattle
// Regular mode: 3 points per correct answer
// Team tournament: 5 points per correct answer
// 1v1 tournament: 7 points per correct answer

export type GameMode = "regular" | "team_tournament" | "1v1_tournament"

export function calculatePoints(correctAnswers: number, mode: GameMode): number {
  const pointsPerAnswer = {
    regular: 3,
    team_tournament: 5,
    "1v1_tournament": 7,
  }

  return correctAnswers * pointsPerAnswer[mode]
}

export function getPointsPerQuestion(mode: GameMode): number {
  const pointsPerAnswer = {
    regular: 3,
    team_tournament: 5,
    "1v1_tournament": 7,
  }

  return pointsPerAnswer[mode]
}
