import { TournamentCompetePage } from "@/components/tournament-compete-page"

export default function TournamentDetailPage({ params }: { params: { id: string } }) {
  return <TournamentCompetePage tournamentId={params.id} />
}
