import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap, Image as ImageIcon, TrendingUp, Clock } from "lucide-react"

const recentProjects = [
  { id: "1", name: "123 Oak Street - Living Room", status: "completed", style: "Modern", createdAt: "2h ago" },
  { id: "2", name: "45 Maple Ave - Bedroom", status: "completed", style: "Scandinavian", createdAt: "Yesterday" },
  { id: "3", name: "78 Pine Rd - Kitchen", status: "processing", style: "Minimalist", createdAt: "Just now" },
]

const statusVariant: Record<string, "success" | "warning" | "secondary"> = {
  completed: "success",
  processing: "warning",
  failed: "secondary",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Welcome back! Ready to stage some properties?</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/upload">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Zap, label: "Credits Remaining", value: "3", sub: "Free plan", color: "text-amber-600", bg: "bg-amber-50" },
          { icon: ImageIcon, label: "Total Projects", value: "3", sub: "This month", color: "text-indigo-600", bg: "bg-indigo-50" },
          { icon: TrendingUp, label: "Images Processed", value: "3", sub: "All time", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Clock, label: "Avg. Processing", value: "45s", sub: "Per image", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Virtual Staging", desc: "Stage an empty room", href: "/upload?type=staging", icon: "🛋️" },
              { label: "Remove Furniture", desc: "Declutter a room", href: "/upload?type=removal", icon: "🧹" },
              { label: "Twilight Effect", desc: "Day to twilight", href: "/upload?type=twilight", icon: "🌅" },
              { label: "Enhance Photo", desc: "Auto-improve quality", href: "/upload?type=enhance", icon: "✨" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{action.label}</p>
                  <p className="text-xs text-zinc-500">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Projects</CardTitle>
          <Link href="/projects" className="text-sm text-indigo-600 hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <ImageIcon className="h-10 w-10 text-zinc-300" />
              <p className="text-sm text-zinc-500">No projects yet. Upload your first photo!</p>
              <Button size="sm" asChild><Link href="/upload">New Project</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                      <ImageIcon className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{project.name}</p>
                      <p className="text-xs text-zinc-500">{project.style} · {project.createdAt}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
