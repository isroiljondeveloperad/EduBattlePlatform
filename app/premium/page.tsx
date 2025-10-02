"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Crown, Zap, Trophy, Users } from "lucide-react"

export default function PremiumPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentProof, setPaymentProof] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/premium/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAmount: 99000,
          paymentMethod,
          paymentProof,
          notes: formData.get("notes"),
        }),
      })

      if (response.ok) {
        router.push("/premium/success")
      } else {
        alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
      }
    } catch (error) {
      console.error("[v0] Premium request error:", error)
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Crown, text: "Barcha turnirlarga kirish" },
    { icon: Zap, text: "Cheksiz janglar" },
    { icon: Trophy, text: "Maxsus mukofotlar" },
    { icon: Users, text: "Jamoa yaratish va boshqarish" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full mb-4">
            <Crown className="w-6 h-6" />
            <span className="font-bold text-lg">Premium Obuna</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">O'z imkoniyatlaringizni kengaytiring</h1>
          <p className="text-xl text-gray-600">Premium obuna bilan barcha funksiyalardan foydalaning</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Features Card */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl">Premium Imkoniyatlar</CardTitle>
              <CardDescription>Siz oladigan barcha afzalliklar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{feature.text}</p>
                  </div>
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              ))}

              <div className="pt-6 border-t">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">99,000</span>
                  <span className="text-xl text-gray-600">so'm</span>
                </div>
                <p className="text-sm text-gray-600">1 oylik obuna</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>To'lov Ma'lumotlari</CardTitle>
              <CardDescription>To'lovni amalga oshiring va ma'lumotlarni kiriting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>To'lov Usuli</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        Bank Kartasi
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="payme" id="payme" />
                      <Label htmlFor="payme" className="flex-1 cursor-pointer">
                        Payme
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="click" id="click" />
                      <Label htmlFor="click" className="flex-1 cursor-pointer">
                        Click
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentProof">To'lov Tasdiqlovchisi (Check raqami yoki screenshot)</Label>
                  <Input
                    id="paymentProof"
                    value={paymentProof}
                    onChange={(e) => setPaymentProof(e.target.value)}
                    placeholder="Check raqami yoki havola"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Qo'shimcha Ma'lumot (ixtiyoriy)</Label>
                  <Textarea id="notes" name="notes" placeholder="Agar biror narsa qo'shmoqchi bo'lsangiz..." rows={3} />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Eslatma:</strong> To'lovingiz admin tomonidan tekshirilgandan so'ng premium obuna
                    faollashtiriladi. Bu odatda 1-2 soat ichida amalga oshiriladi.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Yuborilmoqda..." : "So'rov Yuborish"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
