import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PLANS } from "@/lib/constants"
import { CheckCircle2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-bold text-zinc-900">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-zinc-500">Start free. Scale as you grow.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const isPro = plan.id === "pro"
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex flex-col",
                  isPro && "border-indigo-400 shadow-lg shadow-indigo-100 ring-2 ring-indigo-400"
                )}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                      <Zap className="h-3 w-3" /> Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-zinc-900">${plan.price}</span>
                    {plan.price > 0 && <span className="text-zinc-500">/month</span>}
                  </CardDescription>
                  <p className="text-sm text-zinc-500">
                    {plan.credits === -1 ? "Unlimited credits" : `${plan.credits} credits/month`}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6">
                  <ul className="flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isPro ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href={plan.price === 0 ? "/sign-up" : `/sign-up?plan=${plan.id}`}>
                      {plan.price === 0 ? "Get started free" : `Get ${plan.name}`}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-14 rounded-2xl bg-zinc-100 p-8 text-center">
          <p className="font-medium text-zinc-900">1 credit = 1 AI operation</p>
          <p className="mt-2 text-sm text-zinc-500">
            Virtual Staging · Furniture Removal · Twilight Conversion · Sky Replacement · Photo Enhancement
          </p>
        </div>
      </main>
    </div>
  )
}
