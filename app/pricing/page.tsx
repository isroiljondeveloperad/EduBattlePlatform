"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Trophy, Zap, Users, BarChart3, Star, Shirt } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Warrior",
      price: "Free",
      description: "Perfect for getting started",
      color: "border-muted",
      buttonColor: "bg-muted hover:bg-muted/80 text-muted-foreground",
      features: ["5 battles per day", "Join public tournaments", "Basic analytics", "Standard avatars"],
      buttonText: "Get Started",
      href: "/dashboard",
    },
    {
      name: "Champion",
      price: "$9.99",
      period: "/mo",
      description: "For serious competitors",
      color: "border-battle-purple",
      buttonColor: "bg-battle-purple hover:bg-battle-purple/90",
      popular: true,
      features: [
        "Unlimited battles",
        "Exclusive premium tournaments",
        "Advanced analytics & insights",
        "Custom avatars & themes",
        "Priority matchmaking",
        "Team creation tools",
      ],
      buttonText: "Upgrade to Champion",
      href: "/payment?plan=Champion",
    },
    {
      name: "Legend",
      price: "$19.99",
      period: "/mo",
      description: "For educational institutions",
      color: "border-battle-blue",
      buttonColor: "bg-battle-blue hover:bg-battle-blue/90",
      features: [
        "Everything in Champion",
        "Admin dashboard access",
        "Create custom tests",
        "Manage competitions",
        "Student progress tracking",
        "Merchandise store access",
      ],
      buttonText: "Upgrade to Legend",
      href: "/payment?plan=Legend",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-battle-purple rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EduBattle</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Back to Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-balance">Choose Your Battle Plan</h1>
          <p className="text-xl text-muted-foreground text-pretty">Unlock your full potential with premium features</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? "scale-105" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-battle-purple text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="py-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-battle-green" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href={plan.href}>
                  <Button className={`w-full ${plan.buttonColor}`} size="lg">
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Benefits */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Premium Benefits</h2>
            <p className="text-muted-foreground">Discover what makes our premium plans special</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-battle-purple/5 border-battle-purple/20">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 mx-auto mb-4 text-battle-purple" />
                <h3 className="text-lg font-semibold mb-2">Exclusive Tournaments</h3>
                <p className="text-sm text-muted-foreground">
                  Access premium-only tournaments with bigger prizes and exclusive rewards
                </p>
              </CardContent>
            </Card>

            <Card className="bg-battle-green/5 border-battle-green/20">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-battle-green" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed insights into your performance, strengths, and areas for improvement
                </p>
              </CardContent>
            </Card>

            <Card className="bg-battle-yellow/5 border-battle-yellow/20">
              <CardContent className="p-6 text-center">
                <Shirt className="w-12 h-12 mx-auto mb-4 text-battle-yellow" />
                <h3 className="text-lg font-semibold mb-2">Merchandise Store</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock exclusive clothing, stickers, and collectibles to show your achievements
                </p>
              </CardContent>
            </Card>

            <Card className="bg-battle-blue/5 border-battle-blue/20">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-battle-blue" />
                <h3 className="text-lg font-semibold mb-2">Team Management</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage teams, organize private competitions, and track team progress
                </p>
              </CardContent>
            </Card>

            <Card className="bg-battle-purple/5 border-battle-purple/20">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-battle-purple" />
                <h3 className="text-lg font-semibold mb-2">Priority Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Get matched with opponents faster and access to premium battle modes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-battle-green/5 border-battle-green/20">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-battle-green" />
                <h3 className="text-lg font-semibold mb-2">Custom Themes</h3>
                <p className="text-sm text-muted-foreground">
                  Personalize your experience with custom avatars, themes, and battle effects
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to premium features
                  until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for institutional accounts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Is there a free trial for premium plans?</h3>
                <p className="text-muted-foreground">
                  Yes! All premium plans come with a 7-day free trial. No credit card required to start.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
