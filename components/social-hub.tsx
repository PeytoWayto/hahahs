"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Trophy, Star, UserPlus, UserMinus, Send, ArrowLeft } from "lucide-react"

type SocialTab = "friends" | "profile" | "messages" | "achievements"

interface Friend {
  id: string
  name: string
  online: boolean
  lastSeen: number
  room?: string
  status: "online" | "away" | "busy" | "offline"
}

interface PrivateMessage {
  id: string
  from: string
  to: string
  text: string
  timestamp: number
  read: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface UserProfile {
  name: string
  joinDate: number
  level: number
  experience: number
  friendsCount: number
  gamesPlayed: number
  gamesWon: number
  timeSpent: number
  favoriteRoom: string
  status: string
  achievements: Achievement[]
}

interface SocialHubProps {
  playerName: string
  onSendMessage?: (message: string) => void
  onPrivateMessage?: (to: string, message: string) => void
}

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_login",
    name: "Welcome!",
    description: "Joined Pixel Plaza",
    icon: "👋",
    unlocked: true,
    rarity: "common",
    unlockedAt: Date.now() - 86400000,
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Made 10 friends",
    icon: "🦋",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "game_master",
    name: "Game Master",
    description: "Won 50 mini-games",
    icon: "🎮",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "party_animal",
    name: "Party Animal",
    description: "Danced for 1 hour total",
    icon: "🎉",
    unlocked: true,
    rarity: "common",
    unlockedAt: Date.now() - 3600000,
  },
  {
    id: "chat_champion",
    name: "Chat Champion",
    description: "Sent 1000 messages",
    icon: "💬",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "room_explorer",
    name: "Room Explorer",
    description: "Visited all public rooms",
    icon: "🗺️",
    unlocked: true,
    rarity: "common",
    unlockedAt: Date.now() - 7200000,
  },
  {
    id: "fashion_icon",
    name: "Fashion Icon",
    description: "Customized avatar 20 times",
    icon: "👗",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "legend",
    name: "Plaza Legend",
    description: "Reached level 100",
    icon: "👑",
    unlocked: false,
    rarity: "legendary",
  },
]

export default function SocialHub({ playerName, onSendMessage, onPrivateMessage }: SocialHubProps) {
  const [activeTab, setActiveTab] = useState<SocialTab>("friends")
  const [friends, setFriends] = useState<Friend[]>([
    { id: "friend1", name: "Alex_2024", online: true, lastSeen: Date.now(), room: "Lobby", status: "online" },
    { id: "friend2", name: "Luna_Star", online: false, lastSeen: Date.now() - 3600000, status: "offline" },
    { id: "friend3", name: "CodeMaster", online: true, lastSeen: Date.now(), room: "Café", status: "busy" },
    { id: "friend4", name: "PixelArt", online: true, lastSeen: Date.now(), room: "Rooftop", status: "away" },
  ])
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([
    {
      id: "pm1",
      from: "Alex_2024",
      to: playerName,
      text: "Hey! Want to play some games?",
      timestamp: Date.now() - 300000,
      read: false,
    },
    {
      id: "pm2",
      from: playerName,
      to: "Luna_Star",
      text: "Thanks for the help earlier!",
      timestamp: Date.now() - 600000,
      read: true,
    },
    {
      id: "pm3",
      from: "CodeMaster",
      to: playerName,
      text: "Check out the new room!",
      timestamp: Date.now() - 900000,
      read: true,
    },
  ])
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: playerName,
    joinDate: Date.now() - 86400000 * 7, // 7 days ago
    level: 12,
    experience: 2450,
    friendsCount: friends.length,
    gamesPlayed: 47,
    gamesWon: 23,
    timeSpent: 18000, // 5 hours in seconds
    favoriteRoom: "Lobby",
    status: "Living my best pixel life!",
    achievements: SAMPLE_ACHIEVEMENTS,
  })

  const unreadCount = privateMessages.filter((msg) => !msg.read && msg.to === playerName).length
  const unlockedAchievements = userProfile.achievements.filter((a) => a.unlocked)

  const handleSendPrivateMessage = useCallback(() => {
    if (!selectedFriend || !messageText.trim()) return

    const newMessage: PrivateMessage = {
      id: crypto.randomUUID(),
      from: playerName,
      to: selectedFriend,
      text: messageText.trim(),
      timestamp: Date.now(),
      read: true,
    }

    setPrivateMessages((prev) => [...prev, newMessage])
    setMessageText("")
    onPrivateMessage?.(selectedFriend, messageText.trim())
  }, [selectedFriend, messageText, playerName, onPrivateMessage])

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const getStatusColor = (status: Friend["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-400"
    }
  }

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50"
      case "rare":
        return "border-blue-300 bg-blue-50"
      case "epic":
        return "border-purple-300 bg-purple-50"
      case "legendary":
        return "border-yellow-300 bg-yellow-50"
    }
  }

  const FriendsTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Friends ({friends.length})</h3>
        <Button size="sm" variant="outline">
          <UserPlus className="w-4 h-4 mr-1" />
          Add Friend
        </Button>
      </div>

      <div className="space-y-2">
        {friends.map((friend) => (
          <Card key={friend.id} className="p-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {friend.name[0]}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}
                  />
                </div>
                <div>
                  <div className="font-semibold text-sm">{friend.name}</div>
                  <div className="text-xs text-gray-500">
                    {friend.online ? (friend.room ? `In ${friend.room}` : "Online") : formatTime(friend.lastSeen)}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setSelectedFriend(friend.name)}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <UserMinus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-3 bg-blue-50 border-blue-200">
        <div className="text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-sm font-semibold text-blue-800">Find New Friends</div>
          <div className="text-xs text-blue-600 mb-2">Meet people in public rooms!</div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Explore Rooms
          </Button>
        </div>
      </Card>
    </div>
  )

  const MessagesTab = () => {
    if (selectedFriend) {
      const conversation = privateMessages
        .filter(
          (msg) =>
            (msg.from === selectedFriend && msg.to === playerName) ||
            (msg.from === playerName && msg.to === selectedFriend),
        )
        .sort((a, b) => a.timestamp - b.timestamp)

      return (
        <div className="p-4 space-y-4 h-full flex flex-col">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedFriend(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-bold text-gray-800">{selectedFriend}</h3>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {conversation.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === playerName ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.from === playerName ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className={`text-xs mt-1 ${msg.from === playerName ? "text-blue-100" : "text-gray-500"}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a private message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendPrivateMessage()
                }
              }}
            />
            <Button onClick={handleSendPrivateMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Private Messages</h3>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
        </div>

        <div className="space-y-2">
          {Array.from(new Set(privateMessages.map((msg) => (msg.from === playerName ? msg.to : msg.from)))).map(
            (friendName) => {
              const lastMessage = privateMessages
                .filter(
                  (msg) =>
                    (msg.from === friendName && msg.to === playerName) ||
                    (msg.from === playerName && msg.to === friendName),
                )
                .sort((a, b) => b.timestamp - a.timestamp)[0]

              const unreadInConvo = privateMessages.filter(
                (msg) => msg.from === friendName && msg.to === playerName && !msg.read,
              ).length

              return (
                <Card
                  key={friendName}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedFriend(friendName)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {friendName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{friendName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-48">
                          {lastMessage?.from === playerName ? "You: " : ""}
                          {lastMessage?.text}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{formatTime(lastMessage?.timestamp || 0)}</div>
                      {unreadInConvo > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {unreadInConvo}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              )
            },
          )}
        </div>
      </div>
    )
  }

  const ProfileTab = () => (
    <div className="p-4 space-y-4">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userProfile.name[0]}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{userProfile.name}</h3>
            <div className="text-sm text-gray-600">{userProfile.status}</div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold">Level {userProfile.level}</span>
              </div>
              <div className="text-xs text-gray-500">Joined {formatTime(userProfile.joinDate)}</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{userProfile.friendsCount}</div>
          <div className="text-xs text-gray-600">Friends</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{userProfile.gamesWon}</div>
          <div className="text-xs text-gray-600">Games Won</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.floor(userProfile.timeSpent / 3600)}h</div>
          <div className="text-xs text-gray-600">Time Played</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{userProfile.experience}</div>
          <div className="text-xs text-gray-600">Experience</div>
        </Card>
      </div>

      <Card className="p-3">
        <h4 className="font-semibold text-sm mb-2">Experience Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(userProfile.experience % 1000) / 10}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">{userProfile.experience % 1000}/1000 XP to next level</div>
      </Card>
    </div>
  )

  const AchievementsTab = () => {
    const unlockedAchievements = userProfile.achievements.filter((a) => a.unlocked)
    const lockedAchievements = userProfile.achievements.filter((a) => !a.unlocked)

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Achievements</h3>
          <Badge variant="outline">
            {unlockedAchievements.length}/{userProfile.achievements.length}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-green-600 mb-2">Unlocked ({unlockedAchievements.length})</h4>
            <div className="space-y-2">
              {unlockedAchievements.map((achievement) => (
                <Card key={achievement.id} className={`p-3 ${getRarityColor(achievement.rarity)}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                      {achievement.unlockedAt && (
                        <div className="text-xs text-gray-500 mt-1">Unlocked {formatTime(achievement.unlockedAt)}</div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievement.rarity}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Locked ({lockedAchievements.length})</h4>
            <div className="space-y-2">
              {lockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="p-3 opacity-60 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-600">{achievement.name}</div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievement.rarity}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "friends":
        return <FriendsTab />
      case "messages":
        return <MessagesTab />
      case "profile":
        return <ProfileTab />
      case "achievements":
        return <AchievementsTab />
      default:
        return <FriendsTab />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { id: "friends", label: "Friends", icon: Users, badge: friends.filter((f) => f.online).length },
          { id: "messages", label: "Messages", icon: MessageCircle, badge: unreadCount },
          { id: "profile", label: "Profile", icon: Star },
          { id: "achievements", label: "Achievements", icon: Trophy, badge: unlockedAchievements.length },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors relative ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id as SocialTab)}
          >
            <div className="flex items-center justify-center gap-1">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <Badge variant="destructive" className="text-xs h-4 px-1 ml-1">
                  {tab.badge}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  )
}
