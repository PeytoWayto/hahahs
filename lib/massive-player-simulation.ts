export interface GlobalPlayerStats {
  totalOnline: number
  peakToday: number
  averageToday: number
  regionBreakdown: Record<string, number>
  trendDirection: "up" | "down" | "stable"
  lastUpdate: number
}

export interface ExperienceServer {
  id: string
  name: string
  description: string
  category: "adventure" | "social" | "creative" | "competitive" | "roleplay" | "educational"
  maxPlayers: number
  currentPlayers: number
  isOfficial: boolean
  isVerified: boolean
  rating: number
  tags: string[]
  creator?: string
  createdAt: number
  thumbnail: string
  playerHistory: number[]
  isPopular: boolean
  isTrending: boolean
  waitingList?: number
}

class MassivePlayerSimulation {
  private basePlayerCount = 200000 // Minimum 200K players
  private maxPlayerCount = 147000000 // Maximum 147M players
  private currentGlobalCount = 0
  private lastUpdate = 0
  private experiences: ExperienceServer[] = []
  private globalStats: GlobalPlayerStats

  constructor() {
    this.globalStats = {
      totalOnline: 0,
      peakToday: 0,
      averageToday: 0,
      regionBreakdown: {},
      trendDirection: "stable",
      lastUpdate: Date.now(),
    }
    this.initializeExperiences()
    this.updateGlobalPlayerCount()
  }

  private initializeExperiences() {
    const experienceTemplates = [
      {
        name: "Pixel City Roleplay",
        category: "roleplay",
        description: "Live your virtual life in a bustling metropolis",
        maxPlayers: 500,
      },
      {
        name: "Battle Arena Championship",
        category: "competitive",
        description: "Epic PvP battles with ranked matchmaking",
        maxPlayers: 200,
      },
      {
        name: "Creative Building World",
        category: "creative",
        description: "Build amazing structures with unlimited resources",
        maxPlayers: 300,
      },
      {
        name: "Mystery Mansion Investigation",
        category: "adventure",
        description: "Solve puzzles and uncover dark secrets",
        maxPlayers: 150,
      },
      {
        name: "Dance Club Paradise",
        category: "social",
        description: "Party with friends and show off your moves",
        maxPlayers: 400,
      },
      {
        name: "Space Station Alpha",
        category: "roleplay",
        description: "Sci-fi roleplay in deep space",
        maxPlayers: 250,
      },
      {
        name: "Racing Championship",
        category: "competitive",
        description: "High-speed racing with custom vehicles",
        maxPlayers: 100,
      },
      {
        name: "Fashion Show Runway",
        category: "social",
        description: "Showcase your style and vote on outfits",
        maxPlayers: 200,
      },
      {
        name: "Survival Island Challenge",
        category: "adventure",
        description: "Work together to survive on a deserted island",
        maxPlayers: 180,
      },
      {
        name: "Art Gallery Exhibition",
        category: "creative",
        description: "Display and admire player-created artwork",
        maxPlayers: 120,
      },
      {
        name: "School Simulator",
        category: "educational",
        description: "Experience virtual school life and learning",
        maxPlayers: 350,
      },
      {
        name: "Haunted Hotel Horror",
        category: "adventure",
        description: "Escape from a terrifying haunted hotel",
        maxPlayers: 80,
      },
      {
        name: "Music Concert Hall",
        category: "social",
        description: "Attend live virtual concerts and performances",
        maxPlayers: 600,
      },
      {
        name: "Medieval Kingdom",
        category: "roleplay",
        description: "Live as a knight, merchant, or noble in medieval times",
        maxPlayers: 400,
      },
      {
        name: "Cooking Competition",
        category: "competitive",
        description: "Compete in culinary challenges and cook-offs",
        maxPlayers: 160,
      },
      {
        name: "Beach Resort Paradise",
        category: "social",
        description: "Relax and socialize at a tropical beach resort",
        maxPlayers: 300,
      },
      {
        name: "Zombie Apocalypse Survival",
        category: "adventure",
        description: "Team up to survive the zombie outbreak",
        maxPlayers: 200,
      },
      {
        name: "Virtual University Campus",
        category: "educational",
        description: "Attend classes and socialize on campus",
        maxPlayers: 450,
      },
      {
        name: "Superhero Training Academy",
        category: "adventure",
        description: "Train your superpowers and save the city",
        maxPlayers: 220,
      },
      {
        name: "Pet Care Center",
        category: "social",
        description: "Adopt, care for, and play with virtual pets",
        maxPlayers: 280,
      },
    ]

    this.experiences = experienceTemplates.map((template, index) => ({
      id: `exp_${index}`,
      name: template.name,
      description: template.description,
      category: template.category as ExperienceServer["category"],
      maxPlayers: template.maxPlayers,
      currentPlayers: Math.floor(template.maxPlayers * (0.3 + Math.random() * 0.7)), // 30-100% capacity
      isOfficial: Math.random() > 0.3, // 70% official
      isVerified: Math.random() > 0.4, // 60% verified
      rating: 3.5 + Math.random() * 1.5, // 3.5-5.0 rating
      tags: this.generateTags(template.category),
      creator: Math.random() > 0.3 ? undefined : `Creator${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000, // Random creation date within last year
      thumbnail: `/placeholder.svg?height=120&width=200&query=${encodeURIComponent(template.name + " game thumbnail")}`,
      playerHistory: Array.from({ length: 24 }, () => Math.floor(template.maxPlayers * (0.2 + Math.random() * 0.8))),
      isPopular: Math.random() > 0.7,
      isTrending: Math.random() > 0.8,
      waitingList: Math.random() > 0.9 ? Math.floor(Math.random() * 50) : undefined,
    }))
  }

  private generateTags(category: string): string[] {
    const tagsByCategory = {
      adventure: ["exploration", "puzzle", "mystery", "quest", "story"],
      social: ["chat", "party", "friends", "hangout", "community"],
      creative: ["building", "art", "design", "sandbox", "creation"],
      competitive: ["pvp", "tournament", "ranked", "esports", "challenge"],
      roleplay: ["rp", "character", "story", "immersive", "fantasy"],
      educational: ["learning", "school", "knowledge", "study", "academic"],
    }

    const baseTags = tagsByCategory[category] || []
    const commonTags = ["multiplayer", "fun", "popular", "active", "friendly"]

    return [...baseTags.slice(0, 2), ...commonTags.slice(0, 2)]
  }

  private updateGlobalPlayerCount() {
    const now = Date.now()
    const hour = new Date().getHours()
    const dayOfWeek = new Date().getDay()

    // Base multiplier based on time of day (global peak hours)
    let timeMultiplier = 1.0
    if (hour >= 18 && hour <= 23)
      timeMultiplier = 1.8 // Evening peak
    else if (hour >= 12 && hour <= 17)
      timeMultiplier = 1.4 // Afternoon
    else if (hour >= 6 && hour <= 11)
      timeMultiplier = 1.2 // Morning
    else timeMultiplier = 0.6 // Late night/early morning

    // Weekend bonus
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1.0

    // Random events that cause player spikes
    const eventMultiplier = Math.random() > 0.95 ? 1.5 + Math.random() * 0.8 : 1.0

    // Seasonal variations
    const seasonalMultiplier = 0.9 + Math.random() * 0.2

    // Calculate target player count
    const targetCount = Math.floor(
      this.basePlayerCount *
        timeMultiplier *
        weekendMultiplier *
        eventMultiplier *
        seasonalMultiplier *
        (1 + Math.random() * 200), // Can scale up to 200x base (40M players)
    )

    // Ensure we stay within bounds
    this.currentGlobalCount = Math.min(Math.max(targetCount, this.basePlayerCount), this.maxPlayerCount)

    // Update peak if necessary
    if (this.currentGlobalCount > this.globalStats.peakToday) {
      this.globalStats.peakToday = this.currentGlobalCount
    }

    // Calculate trend direction
    const previousCount = this.globalStats.totalOnline
    if (this.currentGlobalCount > previousCount * 1.05) {
      this.globalStats.trendDirection = "up"
    } else if (this.currentGlobalCount < previousCount * 0.95) {
      this.globalStats.trendDirection = "down"
    } else {
      this.globalStats.trendDirection = "stable"
    }

    // Update global stats
    this.globalStats.totalOnline = this.currentGlobalCount
    this.globalStats.lastUpdate = now
    this.globalStats.regionBreakdown = this.calculateRegionalBreakdown()

    // Update experience player counts
    this.updateExperiencePlayerCounts()
  }

  private calculateRegionalBreakdown(): Record<string, number> {
    const regions = ["North America", "Europe", "Asia Pacific", "South America", "Africa", "Oceania"]
    const breakdown: Record<string, number> = {}

    let remaining = this.currentGlobalCount

    regions.forEach((region, index) => {
      if (index === regions.length - 1) {
        breakdown[region] = remaining
      } else {
        const percentage = 0.1 + Math.random() * 0.3 // 10-40% per region
        const count = Math.floor(remaining * percentage)
        breakdown[region] = count
        remaining -= count
      }
    })

    return breakdown
  }

  private updateExperiencePlayerCounts() {
    this.experiences.forEach((exp) => {
      // Calculate base occupancy rate
      let occupancyRate = 0.3 + Math.random() * 0.4 // 30-70% base

      // Popular experiences get higher occupancy
      if (exp.isPopular) occupancyRate += 0.2
      if (exp.isTrending) occupancyRate += 0.15
      if (exp.isVerified) occupancyRate += 0.1
      if (exp.rating > 4.5) occupancyRate += 0.1

      // Some experiences might be at capacity with waiting lists
      if (Math.random() > 0.9) {
        occupancyRate = 1.0
        exp.waitingList = Math.floor(Math.random() * 100)
      } else {
        exp.waitingList = undefined
      }

      // Ensure we don't exceed max capacity
      occupancyRate = Math.min(occupancyRate, 1.0)

      exp.currentPlayers = Math.floor(exp.maxPlayers * occupancyRate)

      // Update player history (keep last 24 hours)
      exp.playerHistory.push(exp.currentPlayers)
      if (exp.playerHistory.length > 24) {
        exp.playerHistory.shift()
      }
    })
  }

  public getGlobalStats(): GlobalPlayerStats {
    return { ...this.globalStats }
  }

  public getExperiences(): ExperienceServer[] {
    return [...this.experiences]
  }

  public getExperiencesByCategory(category: ExperienceServer["category"]): ExperienceServer[] {
    return this.experiences.filter((exp) => exp.category === category)
  }

  public getPopularExperiences(): ExperienceServer[] {
    return this.experiences
      .filter((exp) => exp.isPopular || exp.isTrending)
      .sort((a, b) => b.currentPlayers - a.currentPlayers)
  }

  public getTrendingExperiences(): ExperienceServer[] {
    return this.experiences.filter((exp) => exp.isTrending).sort((a, b) => b.rating - a.rating)
  }

  public searchExperiences(query: string): ExperienceServer[] {
    const lowercaseQuery = query.toLowerCase()
    return this.experiences.filter(
      (exp) =>
        exp.name.toLowerCase().includes(lowercaseQuery) ||
        exp.description.toLowerCase().includes(lowercaseQuery) ||
        exp.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  public joinExperience(experienceId: string): { success: boolean; message: string } {
    const experience = this.experiences.find((exp) => exp.id === experienceId)
    if (!experience) {
      return { success: false, message: "Experience not found" }
    }

    if (experience.currentPlayers >= experience.maxPlayers) {
      if (!experience.waitingList) experience.waitingList = 0
      experience.waitingList++
      return { success: false, message: `Experience is full. You are #${experience.waitingList} in the waiting list.` }
    }

    experience.currentPlayers++
    return { success: true, message: `Successfully joined ${experience.name}!` }
  }

  public leaveExperience(experienceId: string): void {
    const experience = this.experiences.find((exp) => exp.id === experienceId)
    if (experience && experience.currentPlayers > 0) {
      experience.currentPlayers--

      // Move someone from waiting list if available
      if (experience.waitingList && experience.waitingList > 0) {
        experience.waitingList--
        experience.currentPlayers++
      }
    }
  }

  public startUpdateLoop(): void {
    // Update every 10 seconds
    setInterval(() => {
      this.updateGlobalPlayerCount()
    }, 10000)

    // Initial update
    this.updateGlobalPlayerCount()
  }

  public formatPlayerCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }
}

// Global singleton instance
export const massivePlayerSim = new MassivePlayerSimulation()

// Auto-start the update loop
if (typeof window !== "undefined") {
  massivePlayerSim.startUpdateLoop()
}
