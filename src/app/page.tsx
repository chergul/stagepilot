import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Wand2, Sun, Sofa, ArrowRight, CheckCircle2, Zap } from "lucide-react"

const features = [
  {
    icon: Sofa,
    title: "Virtual Staging",
    description: "Transform empty rooms into beautifully furnished spaces. Choose from 7 design styles.",
  },
  {
    icon: Wand2,
    title: "Furniture Removal",
    description: "Remove existing furniture automatically or manually select items to declutter.",
  },
  {
    icon: Sun,
    title: "Twilight Conversion",
    description: "Turn daytime exterior shots into stunning golden-hour twilight photos.",
  },
  {
    icon: Sparkles,
    title: "Photo Enhancement",
    description: "Auto-correct brightness, contrast and color to make every photo shine.",
  },
]

const stats = [
  { value: "10x", label: "Faster than traditional staging" },
  { value: "$200", label: "Average savings per property" },
  { value: "98%", label: "Client satisfaction rate" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-900">StageAI</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-zinc-600 hover:text-zinc-900">Features</Link>
            <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-6 pb-24 pt-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <Zap className="h-3.5 w-3.5" />
              AI-powered real estate photography
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Stage any property in{" "}
              <span className="text-indigo-600">seconds</span>
            </h1>
            <p className="mt-6 text-xl text-zinc-500">
              Upload a photo. Our AI removes furniture, stages the room beautifully, and converts day shots to twilight — all with one click.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link href="/sign-up">
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-zinc-400">3 free credits. No credit card required.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-zinc-100 bg-zinc-50 py-14">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-3 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold text-indigo-600">{stat.value}</p>
                  <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-zinc-900">Everything you need</h2>
              <p className="mt-4 text-lg text-zinc-500">Professional real estate photo editing powered by AI</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-zinc-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-indigo-600 px-6 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white">Ready to transform your listings?</h2>
            <p className="mt-4 text-lg text-indigo-200">Start with 3 free credits. No credit card required.</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {["Virtual Staging", "Furniture Removal", "Twilight Conversion"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-indigo-100">
                  <CheckCircle2 className="h-4 w-4 text-indigo-300" />
                  {item}
                </div>
              ))}
            </div>
            <Button size="lg" variant="secondary" className="mt-8 px-10" asChild>
              <Link href="/sign-up">Get started for free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-10 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} StageAI. All rights reserved.
      </footer>
    </div>
  )
}
