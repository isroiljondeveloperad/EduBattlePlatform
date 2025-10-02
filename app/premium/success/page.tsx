import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">So'rov Yuborildi!</CardTitle>
          <CardDescription>Premium obuna so'rovingiz muvaffaqiyatli yuborildi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Keyingi Qadam</p>
              <p>
                Admin to'lovingizni tekshiradi va tasdiqlaydi. Bu odatda 1-2 soat ichida amalga oshiriladi.
                Tasdiqlangandan so'ng sizga xabar beriladi.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" variant="default">
              <Link href="/dashboard">Bosh Sahifaga Qaytish</Link>
            </Button>
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/profile">Profilni Ko'rish</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
