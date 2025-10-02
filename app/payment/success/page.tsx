"use client"

import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  const plan = searchParams.get("plan") || "Champion"
  const price = plan === "Champion" ? "$9.99" : "$19.99"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">
            {language === "uz" ? "To'lov muvaffaqiyatli!" : "Payment Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {language === "uz"
                ? `${plan} rejasi uchun ${price} to\'lov muvaffaqiyatli amalga oshirildi.`
                : `Your payment of ${price} for the ${plan} plan has been processed successfully.`}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  {language === "uz" ? "Admin tasdiqini kutish" : "Pending Admin Approval"}
                </h3>
                <p className="text-sm text-yellow-700">
                  {language === "uz"
                    ? "Sizning premium obunangiz admin tomonidan tasdiqlanishi kerak. Bu odatda 24 soat ichida amalga oshiriladi. Tasdiqlangandan so'ng barcha premium imkoniyatlar faollashadi."
                    : "Your premium subscription requires admin approval. This usually takes up to 24 hours. Once approved, all premium features will be activated."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              {language === "uz" ? "Premium imkoniyatlar" : "Premium Features"}
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {language === "uz" ? "Cheksiz janglar" : "Unlimited battles"}</li>
              <li>• {language === "uz" ? "Eksklyuziv turnirlar" : "Exclusive tournaments"}</li>
              <li>• {language === "uz" ? "Kengaytirilgan statistika" : "Advanced analytics"}</li>
              <li>• {language === "uz" ? "Maxsus avatarlar" : "Custom avatars"}</li>
              {plan === "Legend" && (
                <>
                  <li>• {language === "uz" ? "Admin panel" : "Admin dashboard"}</li>
                  <li>• {language === "uz" ? "Do'kon kirish" : "Store access"}</li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-battle-purple hover:bg-battle-purple/90">
                {language === "uz" ? "Bosh sahifaga qaytish" : "Return to Dashboard"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="w-full bg-transparent">
                {language === "uz" ? "Jamoa bilan gaplashish" : "Chat with Community"}
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {language === "uz"
              ? "Savollaringiz bo'lsa, admin bilan bog'laning."
              : "If you have any questions, please contact admin."}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
