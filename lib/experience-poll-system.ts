export interface PollOption {
  id: string
  text: string
  votes: number
  voters: string[] // Player names who voted for this option
}

export interface ExperiencePoll {
  id: string
  title: string
  description: string
  createdBy: string
  createdAt: number
  expiresAt: number
  options: PollOption[]
  totalVotes: number
  isActive: boolean
  category: "experience-rating" | "feature-request" | "general" | "event-planning"
  relatedExperienceId?: string
  tags: string[]
}

export interface PollVote {
  pollId: string
  optionId: string
  voterName: string
  timestamp: number
}

class ExperiencePollSystem {
  private polls: ExperiencePoll[] = []
  private votes: PollVote[] = []
  private botNames = [
    "PollBot_Alpha",
    "VoteWiz",
    "SurveyMaster",
    "OpinionBot",
    "ChoiceHelper",
    "DecisionMaker",
    "PollParticipant",
    "VotingExpert",
  ]

  constructor() {
    this.initializeDefaultPolls()
    this.startBotVotingLoop()
  }

  private initializeDefaultPolls() {
    const defaultPolls: Omit<ExperiencePoll, "id">[] = [
      {
        title: "Which experience should get a major update next?",
        description: "Help us prioritize which experience needs the most improvements!",
        createdBy: "PunstaTeam",
        createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        options: [
          { id: "opt_1", text: "Battle Arena Championship", votes: 0, voters: [] },
          { id: "opt_2", text: "Creative Building World", votes: 0, voters: [] },
          { id: "opt_3", text: "Pixel City Roleplay", votes: 0, voters: [] },
          { id: "opt_4", text: "Mystery Mansion Investigation", votes: 0, voters: [] },
        ],
        totalVotes: 0,
        isActive: true,
        category: "feature-request",
        relatedExperienceId: undefined,
        tags: ["update", "priority", "community"],
      },
      {
        title: "What's your favorite experience category?",
        description: "We want to know what type of experiences you enjoy most!",
        createdBy: "CommunityManager",
        createdAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
        expiresAt: Date.now() + 48 * 60 * 60 * 1000, // 48 hours from now
        options: [
          { id: "opt_1", text: "Adventure & Mystery", votes: 0, voters: [] },
          { id: "opt_2", text: "Social & Roleplay", votes: 0, voters: [] },
          { id: "opt_3", text: "Creative & Building", votes: 0, voters: [] },
          { id: "opt_4", text: "Competitive & PvP", votes: 0, voters: [] },
        ],
        totalVotes: 0,
        isActive: true,
        category: "general",
        tags: ["preferences", "category", "feedback"],
      },
      {
        title: "Should we add a new Halloween event experience?",
        description: "Halloween is coming up! Should we create a special spooky experience?",
        createdBy: "EventPlanner",
        createdAt: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
        expiresAt: Date.now() + 72 * 60 * 60 * 1000, // 72 hours from now
        options: [
          { id: "opt_1", text: "Yes! Haunted mansion adventure", votes: 0, voters: [] },
          { id: "opt_2", text: "Yes! Zombie survival experience", votes: 0, voters: [] },
          { id: "opt_3", text: "Yes! Halloween party social event", votes: 0, voters: [] },
          { id: "opt_4", text: "No, focus on existing experiences", votes: 0, voters: [] },
        ],
        totalVotes: 0,
        isActive: true,
        category: "event-planning",
        tags: ["halloween", "event", "seasonal"],
      },
      {
        title: "Rate the Battle Arena experience",
        description: "How would you rate your experience with Battle Arena Championship?",
        createdBy: "GameDev_Sarah",
        createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        options: [
          { id: "opt_1", text: "Excellent (5 stars)", votes: 0, voters: [] },
          { id: "opt_2", text: "Good (4 stars)", votes: 0, voters: [] },
          { id: "opt_3", text: "Average (3 stars)", votes: 0, voters: [] },
          { id: "opt_4", text: "Needs improvement (2 stars)", votes: 0, voters: [] },
          { id: "opt_5", text: "Poor (1 star)", votes: 0, voters: [] },
        ],
        totalVotes: 0,
        isActive: true,
        category: "experience-rating",
        relatedExperienceId: "exp_1",
        tags: ["rating", "feedback", "battle-arena"],
      },
    ]

    this.polls = defaultPolls.map((poll, index) => ({
      ...poll,
      id: `poll_${index}`,
    }))

    // Add some initial bot votes to make polls look active
    this.addInitialBotVotes()
  }

  private addInitialBotVotes() {
    this.polls.forEach((poll) => {
      const botVoteCount = Math.floor(Math.random() * 15) + 5 // 5-20 bot votes per poll
      for (let i = 0; i < botVoteCount; i++) {
        const randomOption = poll.options[Math.floor(Math.random() * poll.options.length)]
        const randomBot = this.botNames[Math.floor(Math.random() * this.botNames.length)]
        const botName = `${randomBot}_${Math.floor(Math.random() * 999)}`

        // Check if this bot already voted
        if (!randomOption.voters.includes(botName)) {
          this.castVote(poll.id, randomOption.id, botName, true)
        }
      }
    })
  }

  private startBotVotingLoop() {
    // Bots vote every 30-120 seconds
    setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance each interval
        this.simulateBotVote()
      }
    }, 45000) // Check every 45 seconds
  }

  private simulateBotVote() {
    const activePolls = this.polls.filter((poll) => poll.isActive && poll.expiresAt > Date.now())
    if (activePolls.length === 0) return

    const randomPoll = activePolls[Math.floor(Math.random() * activePolls.length)]
    const randomOption = randomPoll.options[Math.floor(Math.random() * randomPoll.options.length)]
    const randomBot = this.botNames[Math.floor(Math.random() * this.botNames.length)]
    const botName = `${randomBot}_${Math.floor(Math.random() * 999)}`

    // Check if this bot already voted in this poll
    const hasVoted = randomPoll.options.some((option) => option.voters.includes(botName))
    if (!hasVoted) {
      this.castVote(randomPoll.id, randomOption.id, botName, true)
    }
  }

  public createPoll(
    title: string,
    description: string,
    options: string[],
    createdBy: string,
    category: ExperiencePoll["category"],
    durationHours = 24,
    relatedExperienceId?: string,
  ): ExperiencePoll {
    const pollId = `poll_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const pollOptions: PollOption[] = options.map((text, index) => ({
      id: `opt_${index + 1}`,
      text,
      votes: 0,
      voters: [],
    }))

    const newPoll: ExperiencePoll = {
      id: pollId,
      title,
      description,
      createdBy,
      createdAt: Date.now(),
      expiresAt: Date.now() + durationHours * 60 * 60 * 1000,
      options: pollOptions,
      totalVotes: 0,
      isActive: true,
      category,
      relatedExperienceId,
      tags: this.generateTags(title, description, category),
    }

    this.polls.unshift(newPoll) // Add to beginning of array
    return newPoll
  }

  private generateTags(title: string, description: string, category: string): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const possibleTags = [
      "feedback",
      "community",
      "update",
      "feature",
      "event",
      "rating",
      "improvement",
      "suggestion",
      "vote",
      "opinion",
    ]

    const tags = [category]
    possibleTags.forEach((tag) => {
      if (text.includes(tag) && !tags.includes(tag)) {
        tags.push(tag)
      }
    })

    return tags.slice(0, 4) // Limit to 4 tags
  }

  public castVote(pollId: string, optionId: string, voterName: string, isBot = false): boolean {
    const poll = this.polls.find((p) => p.id === pollId)
    if (!poll || !poll.isActive || poll.expiresAt <= Date.now()) {
      return false
    }

    // Check if user already voted
    const hasVoted = poll.options.some((option) => option.voters.includes(voterName))
    if (hasVoted) {
      return false
    }

    const option = poll.options.find((opt) => opt.id === optionId)
    if (!option) {
      return false
    }

    // Cast the vote
    option.votes++
    option.voters.push(voterName)
    poll.totalVotes++

    // Record the vote
    this.votes.push({
      pollId,
      optionId,
      voterName,
      timestamp: Date.now(),
    })

    return true
  }

  public getPolls(category?: ExperiencePoll["category"], activeOnly = true): ExperiencePoll[] {
    let filtered = this.polls

    if (activeOnly) {
      filtered = filtered.filter((poll) => poll.isActive && poll.expiresAt > Date.now())
    }

    if (category) {
      filtered = filtered.filter((poll) => poll.category === category)
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt)
  }

  public getPoll(pollId: string): ExperiencePoll | null {
    return this.polls.find((poll) => poll.id === pollId) || null
  }

  public hasUserVoted(pollId: string, voterName: string): boolean {
    const poll = this.polls.find((p) => p.id === pollId)
    if (!poll) return false

    return poll.options.some((option) => option.voters.includes(voterName))
  }

  public getUserVote(pollId: string, voterName: string): string | null {
    const poll = this.polls.find((p) => p.id === pollId)
    if (!poll) return null

    const votedOption = poll.options.find((option) => option.voters.includes(voterName))
    return votedOption?.id || null
  }

  public getPopularPolls(): ExperiencePoll[] {
    return this.polls
      .filter((poll) => poll.isActive && poll.expiresAt > Date.now())
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 5)
  }

  public getRecentPolls(): ExperiencePoll[] {
    return this.polls
      .filter((poll) => poll.isActive && poll.expiresAt > Date.now())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
  }

  public searchPolls(query: string): ExperiencePoll[] {
    const lowercaseQuery = query.toLowerCase()
    return this.polls.filter(
      (poll) =>
        poll.title.toLowerCase().includes(lowercaseQuery) ||
        poll.description.toLowerCase().includes(lowercaseQuery) ||
        poll.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  public closePoll(pollId: string): boolean {
    const poll = this.polls.find((p) => p.id === pollId)
    if (!poll) return false

    poll.isActive = false
    return true
  }

  public getTimeRemaining(poll: ExperiencePoll): string {
    const now = Date.now()
    const remaining = poll.expiresAt - now

    if (remaining <= 0) return "Expired"

    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  public getPollResults(pollId: string): { option: PollOption; percentage: number }[] {
    const poll = this.polls.find((p) => p.id === pollId)
    if (!poll || poll.totalVotes === 0) return []

    return poll.options.map((option) => ({
      option,
      percentage: Math.round((option.votes / poll.totalVotes) * 100),
    }))
  }
}

// Global singleton instance
export const experiencePollSystem = new ExperiencePollSystem()

// Auto-start the system
if (typeof window !== "undefined") {
  // System is already initialized in constructor
}
