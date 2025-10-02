import { TournamentResultsPage } from "@/components/tournament-results-page"

export default function TournamentResultsPageRoute({ params }: { params: { id: string } }) {
  return <TournamentResultsPage tournamentId={params.id} />
}
