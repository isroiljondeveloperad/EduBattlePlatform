"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Search, Crown, Clock, CheckCircle, XCircle, Eye, CreditCard, Calendar } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { dataStore, type Subscription } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"

export default function SubscriptionsPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = () => {
    try {
      const subs = dataStore.getSubscriptions()
      setSubscriptions(subs)
    } catch (error) {
      console.error("[v0] Error fetching subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (subscriptionId: string) => {
    try {
      const success = dataStore.updateSubscriptionStatus(subscriptionId, "approved")

      if (success) {
        fetchSubscriptions()
        toast({
          title: language === "uz" ? "Tasdiqlandi" : "Approved",
          description: language === "uz" ? "Obuna muvaffaqiyatli tasdiqlandi" : "Subscription approved successfully",
        })

        // Reload page to update user's premium status if they're logged in
        window.dispatchEvent(new Event("storage"))
      }
    } catch (error) {
      console.error("[v0] Error approving subscription:", error)
      toast({
        title: language === "uz" ? "Xatolik" : "Error",
        description: language === "uz" ? "Obunani tasdiqlashda xatolik" : "Error approving subscription",
        variant: "destructive",
      })
    }
  }

  const handleReject = (subscriptionId: string) => {
    try {
      const success = dataStore.updateSubscriptionStatus(subscriptionId, "rejected")

      if (success) {
        fetchSubscriptions()
        toast({
          title: language === "uz" ? "Rad etildi" : "Rejected",
          description: language === "uz" ? "Obuna rad etildi" : "Subscription rejected",
        })
      }
    } catch (error) {
      console.error("[v0] Error rejecting subscription:", error)
      toast({
        title: language === "uz" ? "Xatolik" : "Error",
        description: language === "uz" ? "Obunani rad etishda xatolik" : "Error rejecting subscription",
        variant: "destructive",
      })
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || sub.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {language === "uz" ? "Kutilmoqda" : "Pending"}
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {language === "uz" ? "Tasdiqlangan" : "Approved"}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            {language === "uz" ? "Rad etilgan" : "Rejected"}
          </Badge>
        )
      default:
        return null
    }
  }

  const getPlanBadge = (plan: string) => {
    const color = plan === "Champion" ? "bg-battle-purple" : "bg-battle-blue"
    return (
      <Badge className={`${color} text-white`}>
        <Crown className="w-3 h-3 mr-1" />
        {plan}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "uz" ? "uz-UZ" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pendingCount = subscriptions.filter((sub) => sub.status === "pending").length
  const approvedCount = subscriptions.filter((sub) => sub.status === "approved").length
  const rejectedCount = subscriptions.filter((sub) => sub.status === "rejected").length

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="EduBattle Admin" showBackButton />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "uz" ? "Obuna Boshqaruvi" : "Subscription Management"}
          </h1>
          <p className="text-muted-foreground">
            {language === "uz"
              ? "Premium obunalarni tasdiqlash va boshqarish"
              : "Approve and manage premium subscriptions"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === "uz" ? "Kutilayotgan" : "Pending"}</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === "uz" ? "Tasdiqlangan" : "Approved"}</p>
                  <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === "uz" ? "Rad etilgan" : "Rejected"}</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === "uz" ? "Jami" : "Total"}</p>
                  <p className="text-2xl font-bold">{subscriptions.length}</p>
                </div>
                <Crown className="w-8 h-8 text-battle-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={language === "uz" ? "Foydalanuvchi qidirish..." : "Search users..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status as any)}
                    className={selectedStatus === status ? "bg-battle-purple hover:bg-battle-purple/90" : ""}
                  >
                    {status === "all" && (language === "uz" ? "Barchasi" : "All")}
                    {status === "pending" && (language === "uz" ? "Kutilayotgan" : "Pending")}
                    {status === "approved" && (language === "uz" ? "Tasdiqlangan" : "Approved")}
                    {status === "rejected" && (language === "uz" ? "Rad etilgan" : "Rejected")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "uz" ? "Obuna So'rovlari" : "Subscription Requests"}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <Crown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {language === "uz" ? "Obuna so'rovlari topilmadi" : "No subscription requests found"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "uz" ? "Foydalanuvchi" : "User"}</TableHead>
                    <TableHead>{language === "uz" ? "Reja" : "Plan"}</TableHead>
                    <TableHead>{language === "uz" ? "Narx" : "Price"}</TableHead>
                    <TableHead>{language === "uz" ? "To'lov sanasi" : "Payment Date"}</TableHead>
                    <TableHead>{language === "uz" ? "Holat" : "Status"}</TableHead>
                    <TableHead>{language === "uz" ? "Amallar" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/student-avatar.png" />
                            <AvatarFallback>{subscription.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{subscription.userName}</p>
                            <p className="text-sm text-muted-foreground">{subscription.userEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                      <TableCell className="font-medium">{subscription.amount}</TableCell>
                      <TableCell className="text-sm">{formatDate(subscription.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  {language === "uz" ? "Obuna Tafsilotlari" : "Subscription Details"}
                                </DialogTitle>
                                <DialogDescription>
                                  {language === "uz"
                                    ? "To'liq obuna ma'lumotlari"
                                    : "Complete subscription information"}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">
                                      {language === "uz" ? "Foydalanuvchi" : "User"}
                                    </label>
                                    <p className="text-sm text-muted-foreground">{subscription.userName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">{subscription.userEmail}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">{language === "uz" ? "Reja" : "Plan"}</label>
                                    <p className="text-sm text-muted-foreground">{subscription.plan}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      {language === "uz" ? "Narx" : "Price"}
                                    </label>
                                    <p className="text-sm text-muted-foreground">{subscription.amount}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      {language === "uz" ? "To'lov usuli" : "Payment Method"}
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="w-4 h-4" />
                                      <span className="text-sm text-muted-foreground">
                                        {subscription.paymentMethod} ****{subscription.paymentProof}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      {language === "uz" ? "To'lov sanasi" : "Payment Date"}
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      <span className="text-sm text-muted-foreground">
                                        {formatDate(subscription.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {subscription.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(subscription.id)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(subscription.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
