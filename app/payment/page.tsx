"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock, ArrowLeft, Crown, Copy, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { dataStore } from "@/lib/data-store"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { t } = useLanguage()

  const plan = searchParams.get("plan") || "Champion"
  const price = plan === "Champion" ? "$9.99" : "$19.99"

  const recipientCardNumber = "9860 2345 6543 2323"
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cardholderName: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(recipientCardNumber.replace(/\s/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Karta raqami 16 ta raqamdan iborat bo'lishi kerak"
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Amal qilish muddati noto'g'ri (MM/YY formatida)"
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Karta egasining to'liq ismi kiritilishi shart"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!user) {
      alert("Iltimos avval tizimga kiring")
      router.push("/")
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const subscription = {
        id: `sub_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email || "",
        amount: price,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        paymentMethod: "Card",
        paymentProof: formData.cardNumber.slice(-4),
        plan: plan,
      }

      dataStore.saveSubscription(subscription)

      setIsProcessing(false)
      router.push(`/payment/success?plan=${plan}&price=${price}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/pricing">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("payment.title")}</h1>
          <p className="text-gray-600">Payme orqali xavfsiz to'lov</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-battle-purple" />
                {t("payment.orderSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-battle-purple/5 rounded-lg">
                <div>
                  <h3 className="font-semibold">{plan} Reja</h3>
                  <p className="text-sm text-muted-foreground">Oylik obuna</p>
                </div>
                <Badge variant="secondary" className="bg-battle-purple/10 text-battle-purple">
                  {price}/oy
                </Badge>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <p className="text-sm font-medium text-blue-900">To'lov qabul qiluvchi karta:</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-lg font-mono font-semibold text-blue-900">{recipientCardNumber}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCardNumber}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Nusxalandi
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Nusxalash
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-blue-700">
                  Ushbu karta raqamiga to'lovni amalga oshiring va pastda o'z karta ma'lumotlaringizni kiriting
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Soliq:</span>
                  <span>$0.00</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Jami:</span>
                  <span>{price}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">{t("payment.approvalMessage")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                To'lov Ma'lumotlari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="cardNumber">{t("payment.cardNumber")}</Label>
                  <Input
                    id="cardNumber"
                    placeholder={t("payment.cardNumberPlaceholder")}
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                    maxLength={19}
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="expiryDate">{t("payment.expiryDate")}</Label>
                  <Input
                    id="expiryDate"
                    placeholder={t("payment.expiryPlaceholder")}
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                    maxLength={5}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
                </div>

                <div>
                  <Label htmlFor="cardholderName">{t("payment.cardholderName")}</Label>
                  <Input
                    id="cardholderName"
                    placeholder={t("payment.namePlaceholder")}
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                    className={errors.cardholderName ? "border-red-500" : ""}
                  />
                  {errors.cardholderName && <p className="text-sm text-red-500 mt-1">{errors.cardholderName}</p>}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Sizning ma'lumotlaringiz xavfsiz himoyalangan</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-battle-purple hover:bg-battle-purple/90"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Ishlov berilmoqda...
                    </div>
                  ) : (
                    <>
                      {t("payment.processPayment")} {price}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
