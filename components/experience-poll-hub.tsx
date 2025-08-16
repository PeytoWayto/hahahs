"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Vote, Clock, Users, TrendingUp, Search, CheckCircle, MessageSquare, Star, Calendar } from "lucide-react"
import { experiencePollSystem, type ExperiencePoll } from "@/lib/experience-poll-system"

interface ExperiencePollHubProps {
  playerName: string
  onSendMessage: (message: string) => void
}

export default function ExperiencePollHub({ playerName, onSendMessage }: ExperiencePollHubProps) {
  const [polls, setPolls] = useState<ExperiencePoll[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Create poll form state
  const [newPollTitle, setNewPollTitle] = useState("")
  const [newPollDescription, setNewPollDescription] = useState("")
  const [newPollOptions, setNewPollOptions] = useState(["", ""])
  const [newPollCategory, setNewPollCategory] = useState<ExperiencePoll["category"]>("general")
  const [newPollDuration, setNewPollDuration] = useState(24)

  useEffect(() => {
    // Load polls initially
    updatePolls()

    // Update polls every 30 seconds
    const interval = setInterval(updatePolls, 30000)
    return () => clearInterval(interval)
  }, [selectedCategory])

  const updatePolls = () => {
    if (selectedCategory === "all") {
      setPolls(experiencePollSystem.getPolls())
    } else {
      setPolls(experiencePollSystem.getPolls(selectedCategory as ExperiencePoll["category"]))
    }
  }

  const handleCreatePoll = () => {
    if (!newPollTitle.trim() || newPollOptions.filter((opt) => opt.trim()).length < 2) {
      return
    }

    const validOptions = newPollOptions.filter((opt) => opt.trim())
    const poll = experiencePollSystem.createPoll(
      newPollTitle,
      newPollDescription,
      validOptions,
      playerName,
      newPollCategory,
      newPollDuration,
    )

    onSendMessage(`📊 ${playerName} created a new poll: "${newPollTitle}"`)

    // Reset form
    setNewPollTitle("")
    setNewPollDescription("")
    setNewPollOptions(["", ""])
    setNewPollCategory("general")
    setNewPollDuration(24)
    setShowCreateForm(false)

    updatePolls()
  }

  const handleVote = (pollId: string, optionId: string) => {
    const success = experiencePollSystem.castVote(pollId, optionId, playerName)
    if (success) {
      const poll = experiencePollSystem.getPoll(pollId)
      const option = poll?.options.find((opt) => opt.id === optionId)
      onSendMessage(`🗳️ ${playerName} voted "${option?.text}" in poll: "${poll?.title}"`)
      updatePolls()
    }
  }

  const addPollOption = () => {
    if (newPollOptions.length < 6) {
      setNewPollOptions([...newPollOptions, ""])
    }
  }

  const removePollOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, i) => i !== index))
    }
  }

  const updatePollOption = (index: number, value: string) => {
    const updated = [...newPollOptions]
    updated[index] = value
    setNewPollOptions(updated)
  }

  const filteredPolls = searchQuery.trim() ? experiencePollSystem.searchPolls(searchQuery) : polls

  const categories = [
    { id: "all", label: "All Polls", icon: Vote },
    { id: "general", label: "General", icon: MessageSquare },
    { id: "experience-rating", label: "Ratings", icon: Star },
    { id: "feature-request", label: "Features", icon: TrendingUp },
    { id: "event-planning", label: "Events", icon: Calendar },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-sm">Experience Polls</span>
          </div>
          <Button size="sm" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-3 h-3 mr-1" />
            Create Poll
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
      </div>

      {/* Create Poll Form */}
      {showCreateForm && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div>
              <Input
                placeholder="Poll title..."
                value={newPollTitle}
                onChange={(e) => setNewPollTitle(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <Textarea
                placeholder="Poll description (optional)..."
                value={newPollDescription}
                onChange={(e) => setNewPollDescription(e.target.value)}
                className="text-sm h-16 resize-none"
              />
            </div>

            {/* Poll Options */}
            <div className="space-y-2">
              <div className="text-xs font-medium">Options:</div>
              {newPollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}...`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    className="text-sm"
                  />
                  {newPollOptions.length > 2 && (
                    <Button variant="outline" size="sm" onClick={() => removePollOption(index)}>
                      ×
                    </Button>
                  )}
                </div>
              ))}
              {newPollOptions.length < 6 && (
                <Button variant="outline" size="sm" onClick={addPollOption} className="text-xs bg-transparent">
                  + Add Option
                </Button>
              )}
            </div>

            {/* Category and Duration */}
            <div className="flex gap-2">
              <select
                value={newPollCategory}
                onChange={(e) => setNewPollCategory(e.target.value as ExperiencePoll["category"])}
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="general">General</option>
                <option value="experience-rating">Experience Rating</option>
                <option value="feature-request">Feature Request</option>
                <option value="event-planning">Event Planning</option>
              </select>
              <select
                value={newPollDuration}
                onChange={(e) => setNewPollDuration(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePoll} size="sm" className="flex-1">
                Create Poll
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 gap-1 h-auto p-1 mx-3 mt-2">
          {categories.map((category) => {
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

        <TabsContent value={selectedCategory} className="flex-1 overflow-hidden mt-2">
          <div className="h-full overflow-y-auto">
            <div className="p-3 space-y-3">
              {filteredPolls.map((poll) => {
                const hasVoted = experiencePollSystem.hasUserVoted(poll.id, playerName)
                const userVote = experiencePollSystem.getUserVote(poll.id, playerName)
                const results = experiencePollSystem.getPollResults(poll.id)
                const timeRemaining = experiencePollSystem.getTimeRemaining(poll)

                return (
                  <div key={poll.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{poll.title}</h3>
                        {poll.description && <p className="text-xs text-gray-600 mb-2">{poll.description}</p>}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>by {poll.createdBy}</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {poll.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{timeRemaining}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{poll.totalVotes} votes</span>
                        </div>
                      </div>
                    </div>

                    {/* Poll Options */}
                    <div className="space-y-2">
                      {poll.options.map((option) => {
                        const result = results.find((r) => r.option.id === option.id)
                        const percentage = result?.percentage || 0
                        const isUserChoice = userVote === option.id

                        return (
                          <div key={option.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Button
                                variant={hasVoted ? "outline" : "default"}
                                size="sm"
                                disabled={hasVoted}
                                onClick={() => handleVote(poll.id, option.id)}
                                className={`flex-1 justify-start text-xs ${
                                  isUserChoice ? "bg-blue-100 border-blue-300" : ""
                                }`}
                              >
                                {isUserChoice && <CheckCircle className="w-3 h-3 mr-1 text-blue-600" />}
                                {option.text}
                              </Button>
                              <span className="text-xs text-gray-500 ml-2 min-w-[3rem] text-right">
                                {option.votes} ({percentage}%)
                              </span>
                            </div>
                            {hasVoted && <Progress value={percentage} className="h-1" />}
                          </div>
                        )
                      })}
                    </div>

                    {/* Poll Tags */}
                    {poll.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {poll.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredPolls.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Vote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No polls found</div>
                  <div className="text-xs">Try creating a new poll or changing your search!</div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
