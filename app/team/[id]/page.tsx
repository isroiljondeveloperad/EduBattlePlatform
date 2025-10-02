import { TeamDetailPage } from "@/components/team-detail-page"

export default function Page({ params }: { params: { id: string } }) {
  return <TeamDetailPage teamId={params.id} />
}
