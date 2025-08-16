"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Star, TrendingUp, Clock, Filter, Play, Crown, Shield, Flame, Globe } from "lucide-react"
import { massivePlayerSim, type ExperienceServer, type GlobalPlayerStats } from "@/lib/massive-player-simulation"
import ExperienceLauncher from "./experiences/experience-launcher"

interface ExperienceBrowserProps {
  playerName: string
  onJoinExperience?: (experienceId: string) => void
  onSendMessage: (message: string) => void
}

export default function ExperienceBrowser({ playerName, onJoinExperience, onSendMessage }: ExperienceBrowserProps) {
  const [experiences, setExperiences] = useState<ExperienceServer[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalPlayerStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"players" | "rating" | "trending">("players")
  const [launchedExperience, setLaunchedExperience] = useState<ExperienceServer | null>(null)

  useEffect(() => {
    // Initial load
    setExperiences(massivePlayerSim.getExperiences())
    setGlobalStats(massivePlayerSim.getGlobalStats())

    // Update every 10 seconds
    const interval = setInterval(() => {
      setExperiences(massivePlayerSim.getExperiences())
      setGlobalStats(massivePlayerSim.getGlobalStats())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredExperiences = useMemo(() => {
    let filtered = experiences

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = massivePlayerSim.searchExperiences(searchQuery)
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((exp) => exp.category === selectedCategory)
    }

    // Sort experiences
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "players":
          return b.currentPlayers - a.currentPlayers
        case "rating":
          return b.rating - a.rating
        case "trending":
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [experiences, searchQuery, selectedCategory, sortBy])

  const categories = [
    { id: "all", label: "All", icon: Globe },
    { id: "social", label: "Social", icon: Users },
    { id: "adventure", label: "Adventure", icon: Play },
    { id: "competitive", label: "Competitive", icon: Crown },
    { id: "creative", label: "Creative", icon: Star },
    { id: "roleplay", label: "Roleplay", icon: Shield },
    { id: "educational", label: "Educational", icon: Clock },
  ]

  const handleJoinExperience = (experience: ExperienceServer) => {
    const result = massivePlayerSim.joinExperience(experience.id)
    if (result.success) {
      setLaunchedExperience(experience)
      onJoinExperience?.(experience.id)
      onSendMessage(`🎮 ${playerName} joined ${experience.name}!`)
      // Update the experiences list to reflect the change
      setExperiences(massivePlayerSim.getExperiences())
    } else {
      // Show error message (in a real app, you'd use a toast or modal)
      alert(result.message)
    }
  }

  const handleCloseExperience = () => {
    if (launchedExperience) {
      massivePlayerSim.leaveExperience(launchedExperience.id)
      onSendMessage(`👋 ${playerName} left ${launchedExperience.name}`)
      setLaunchedExperience(null)
      setExperiences(massivePlayerSim.getExperiences())
    }
  }

  if (launchedExperience) {
    return (
      <ExperienceLauncher
        experienceId={launchedExperience.id}
        experienceName={launchedExperience.name}
        playerName={playerName}
        onClose={handleCloseExperience}
        onSendMessage={onSendMessage}
      />
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Global Stats Header */}
      {globalStats && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-black/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold">Global Stats</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp
                className={`w-3 h-3 ${
                  globalStats.trendDirection === "up"
                    ? "text-green-500"
                    : globalStats.trendDirection === "down"
                      ? "text-red-500"
                      : "text-gray-500"
                }`}
              />
              <span className="capitalize">{globalStats.trendDirection}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-600">Players Online</div>
              <div className="font-bold text-lg text-blue-600">
                {massivePlayerSim.formatPlayerCount(globalStats.totalOnline)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Peak Today</div>
              <div className="font-bold text-lg text-purple-600">
                {massivePlayerSim.formatPlayerCount(globalStats.peakToday)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-3 border-b border-black/10">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
            {categories.slice(0, 4).map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 p-2 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  <span>{category.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
          <TabsList className="grid grid-cols-3 gap-1 h-auto p-1 mt-1">
            {categories.slice(4).map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 p-2 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  <span>{category.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Sort Options */}
      <div className="px-3 py-2 border-b border-black/10">
        <div className="flex gap-2">
          {[
            { id: "players", label: "Most Players" },
            { id: "rating", label: "Highest Rated" },
            { id: "trending", label: "Trending" },
          ].map((sort) => (
            <Button
              key={sort.id}
              variant={sortBy === sort.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(sort.id as any)}
              className="text-xs"
            >
              {sort.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Experience List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">
          {filteredExperiences.map((experience) => (
            <div
              key={experience.id}
              className="border border-black/10 rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                <img
                  src={experience.thumbnail || "/placeholder.svg"}
                  alt={experience.name}
                  className="w-16 h-12 rounded object-cover bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">{experience.name}</h3>
                      {experience.isOfficial && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <Shield className="w-3 h-3 mr-1" />
                          Official
                        </Badge>
                      )}
                      {experience.isVerified && (
                        <Badge variant="default" className="text-xs px-1 py-0">
                          <Crown className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {experience.isTrending && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          <Flame className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{experience.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>
                          {experience.currentPlayers}/{experience.maxPlayers}
                        </span>
                        {experience.waitingList && (
                          <span className="text-orange-500">(+{experience.waitingList} waiting)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{experience.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleJoinExperience(experience)}
                      disabled={experience.currentPlayers >= experience.maxPlayers}
                      className="text-xs px-3 py-1"
                    >
                      {experience.currentPlayers >= experience.maxPlayers ? "Full" : "Join"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {experience.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
