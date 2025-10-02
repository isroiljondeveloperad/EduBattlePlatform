import { TournamentBattlePage } from "@/components/tournament-battle-page"

export default function Page({ params }: { params: { id: string } }) {
  return <TournamentBattlePage tournamentId={params.id} />
}
