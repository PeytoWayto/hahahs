"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sword, Shield, Zap, Heart, Trophy, Target } from "lucide-react"

interface BattleArenaProps {
  playerName: string
  onSendMessage: (message: string) => void
}

export default function BattleArena({ playerName, onSendMessage }: BattleArenaProps) {
  const [health, setHealth] = useState(100)
  const [energy, setEnergy] = useState(100)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [inBattle, setInBattle] = useState(false)
  const [opponent, setOpponent] = useState<string | null>(null)
  const [selectedMove, setSelectedMove] = useState<string | null>(null)

  const moves = [
    { name: "Sword Strike", damage: 25, energy: 20, icon: Sword },
    { name: "Shield Bash", damage: 15, energy: 15, icon: Shield },
    { name: "Lightning Bolt", damage: 35, energy: 30, icon: Zap },
    { name: "Heal", damage: -20, energy: 25, icon: Heart },
  ]

  const opponents = ["Shadow Warrior", "Fire Mage", "Ice Knight", "Storm Archer", "Dark Assassin"]

  const startBattle = () => {
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)]
    setOpponent(randomOpponent)
    setInBattle(true)
    setHealth(100)
    setEnergy(100)
    onSendMessage(`⚔️ ${playerName} challenges ${randomOpponent} to battle!`)
  }

  const executeMove = (move: (typeof moves)[0]) => {
    if (energy < move.energy) return

    setEnergy((prev) => Math.max(0, prev - move.energy))

    if (move.name === "Heal") {
      setHealth((prev) => Math.min(100, prev + 20))
      onSendMessage(`💚 ${playerName} heals for 20 HP!`)
    } else {
      onSendMessage(`💥 ${playerName} uses ${move.name} dealing ${move.damage} damage!`)

      // Simulate opponent's turn
      setTimeout(() => {
        const opponentDamage = Math.floor(Math.random() * 20) + 10
        setHealth((prev) => {
          const newHealth = Math.max(0, prev - opponentDamage)
          if (newHealth <= 0) {
            setInBattle(false)
            setLosses((prev) => prev + 1)
            onSendMessage(`💀 ${playerName} was defeated by ${opponent}!`)
          }
          return newHealth
        })

        if (health > 0) {
          onSendMessage(`🗡️ ${opponent} attacks ${playerName} for ${opponentDamage} damage!`)

          // Check if player wins
          if (Math.random() > 0.7) {
            setInBattle(false)
            setWins((prev) => prev + 1)
            onSendMessage(`🏆 ${playerName} defeats ${opponent}!`)
          }
        }
      }, 1500)
    }
  }

  useEffect(() => {
    // Regenerate energy over time
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(100, prev + 2))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-red-100 to-orange-100">
      {/* Stats Header */}
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600">
              <Trophy className="w-3 h-3 mr-1" />
              Wins: {wins}
            </Badge>
            <Badge variant="outline" className="text-red-600">
              <Target className="w-3 h-3 mr-1" />
              Losses: {losses}
            </Badge>
          </div>
          {inBattle && opponent && <Badge variant="destructive">vs {opponent}</Badge>}
        </div>

        {inBattle && (
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Health</span>
                <span>{health}/100</span>
              </div>
              <Progress value={health} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Energy</span>
                <span>{energy}/100</span>
              </div>
              <Progress value={energy} className="h-2 bg-blue-200" />
            </div>
          </div>
        )}
      </div>

      {/* Main Battle Area */}
      <div className="flex-1 p-4">
        {!inBattle ? (
          <div className="text-center space-y-4">
            <div className="text-lg font-bold">Battle Arena</div>
            <div className="text-sm text-gray-600">Test your combat skills against fierce opponents!</div>
            <Button onClick={startBattle} className="w-full">
              <Sword className="w-4 h-4 mr-2" />
              Find Opponent
            </Button>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-green-600">{wins}</div>
                  <div className="text-gray-600">Victories</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-red-600">{losses}</div>
                  <div className="text-gray-600">Defeats</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-bold mb-2">Battle in Progress</div>
              <div className="text-sm text-gray-600">Choose your move wisely!</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moves.map((move) => {
                const Icon = move.icon
                const canUse = energy >= move.energy
                return (
                  <Button
                    key={move.name}
                    variant={selectedMove === move.name ? "default" : "outline"}
                    disabled={!canUse}
                    onClick={() => executeMove(move)}
                    className="flex flex-col items-center gap-1 h-auto py-3 text-xs"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{move.name}</span>
                    <span className="text-xs opacity-70">{move.damage > 0 ? `${move.damage} DMG` : "Heal 20"}</span>
                    <span className="text-xs opacity-70">{move.energy} Energy</span>
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setInBattle(false)
                onSendMessage(`🏃 ${playerName} retreats from battle!`)
              }}
              className="w-full text-xs"
            >
              Retreat
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
