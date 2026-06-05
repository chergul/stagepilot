"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/layout/navbar"
import { Plus, Image as ImageIcon, Search, Trash2, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const mockProjects = [
  { id: "1", name: "123 Oak Street - Living Room", status: "completed", roomType: "living_room", designStyle: "modern", originalImageUrl: "", stagedImageUrl: "", createdAt: "2026-06-05T10:00:00Z" },
  { id: "2", name: "45 Maple Ave - Bedroom", status: "completed", roomType: "bedroom", designStyle: "scandinavian", originalImageUrl: "", stagedImageUrl: "", createdAt: "2026-06-04T14:30:00Z" },
  { id: "3", name: "78 Pine Rd - Kitchen", status: "failed", roomType: "kitchen", designStyle: "minimalist", originalImageUrl: "", stagedImageUrl: "", createdAt: "2026-06-04T09:15:00Z" },
  { id: "4", name: "200 Elm St - Office", status: "pending", roomType: "office", designStyle: undefined, originalImageUrl: "", stagedImageUrl: "", createdAt: "2026-06-05T11:00:00Z" },
]

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  completed: "success",
  pending: "warning",
  analyzing: "warning",
  staging: "warning",
  failed: "destructive",
}

export default function ProjectsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")

  const filtered = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || p.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Projects</h1>
            <p className="mt-1 text-sm text-zinc-500">{mockProjects.length} total projects</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/upload">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex gap-2">
            {["all", "completed", "pending", "failed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors",
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 py-24 text-center">
            <ImageIcon className="h-12 w-12 text-zinc-300" />
            <div>
              <p className="font-medium text-zinc-600">No projects found</p>
              <p className="mt-1 text-sm text-zinc-400">Try adjusting your search or filters</p>
            </div>
            <Button size="sm" asChild><Link href="/upload">Create your first project</Link></Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((project) => (
              <Card key={project.id} className="group overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3] bg-zinc-100">
                  {project.stagedImageUrl ? (
                    <img src={project.stagedImageUrl} alt={project.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-zinc-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                  </div>
                  {project.status === "completed" && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/projects/${project.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="truncate text-sm font-medium text-zinc-900">{project.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-zinc-400">
                      {project.designStyle && <span className="capitalize">{project.designStyle} · </span>}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    <button className="text-zinc-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
