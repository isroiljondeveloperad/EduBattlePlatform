import { TestTakingPage } from "@/components/test-taking-page"

export default function TestPage({ params }: { params: { id: string } }) {
  return <TestTakingPage testId={params.id} />
}
