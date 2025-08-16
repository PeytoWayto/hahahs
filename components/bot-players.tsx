"use client"

import { useEffect, useRef, useCallback } from "react"
import { generateRandomCustomization, type AvatarCustomization } from "@/lib/avatar-customization"

export interface BotPlayer {
  id: string
  name: string
  color: string
  x: number
  y: number
  facing: "N" | "S" | "E" | "W"
  customization: AvatarCustomization
  personality: "friendly" | "quiet" | "energetic" | "mysterious"
  lastAction: number
  currentPath?: { x: number; y: number }[]
  pathProgress?: number
  dance?: boolean
  sit?: boolean
  wave?: boolean
  laugh?: boolean
}

const BOT_NAMES = [
  "Alex_2024",
  "Luna_Star",
  "CodeMaster",
  "PixelArt",
  "GameGuru",
  "TechWiz",
  "CoolCat",
  "NightOwl",
  "StarGazer",
  "ByteSize",
  "RetroGamer",
  "DigitalDream",
  "CyberPunk",
  "NeonLight",
  "VirtualVibe",
  "DataStream",
  "CloudNine",
  "ZenMode",
]

const BOT_MESSAGES = {
  friendly: [
    "Hey everyone! How's it going?",
    "Love the music in here!",
    "Anyone want to dance?",
    "This place is so cool!",
    "Great to meet you all!",
    "Having a wonderful time here!",
  ],
  quiet: ["...", "*nods*", "Nice place.", "*waves quietly*", "Enjoying the atmosphere.", "*smiles*"],
  energetic: [
    "WOOHOO! This is awesome!",
    "Let's get this party started!",
    "Dance time! 💃",
    "Energy levels: MAXIMUM!",
    "Who's ready to have fun?!",
    "This music is FIRE! 🔥",
  ],
  mysterious: [
    "Interesting...",
    "*observes silently*",
    "The shadows whisper secrets...",
    "*mysterious smile*",
    "Not everything is as it seems...",
    "Time reveals all truths...",
  ],
}

interface BotPlayersProps {
  room: string
  onBotMessage?: (botName: string, message: string) => void
  onBotAction?: (botId: string, action: { type: string; value: boolean }) => void
  gridCols: number
  gridRows: number
  walkableGrid: boolean[]
}

export function useBotPlayers({ room, onBotMessage, onBotAction, gridCols, gridRows, walkableGrid }: BotPlayersProps) {
  const botsRef = useRef<BotPlayer[]>([])
  const lastUpdateRef = useRef(0)

  const createBot = useCallback(
    (id: string): BotPlayer => {
      const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]
      const personalities: BotPlayer["personality"][] = ["friendly", "quiet", "energetic", "mysterious"]

      // Find a random walkable position
      let x = 3,
        y = 3
      let attempts = 0
      while (attempts < 50) {
        const testX = Math.floor(Math.random() * (gridCols - 4)) + 2
        const testY = Math.floor(Math.random() * (gridRows - 4)) + 2
        const index = testY * gridCols + testX
        if (walkableGrid[index]) {
          x = testX
          y = testY
          break
        }
        attempts++
      }

      return {
        id,
        name: `${name}_${Math.floor(Math.random() * 999)}`,
        color: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 6)],
        x,
        y,
        facing: ["N", "S", "E", "W"][Math.floor(Math.random() * 4)] as "N" | "S" | "E" | "W",
        customization: generateRandomCustomization(),
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        lastAction: Date.now(),
        dance: false,
        sit: false,
        wave: false,
        laugh: false,
      }
    },
    [gridCols, gridRows, walkableGrid],
  )

  const findRandomWalkablePosition = useCallback(() => {
    let attempts = 0
    while (attempts < 50) {
      const x = Math.floor(Math.random() * (gridCols - 4)) + 2
      const y = Math.floor(Math.random() * (gridRows - 4)) + 2
      const index = y * gridCols + x
      if (walkableGrid[index]) {
        return { x, y }
      }
      attempts++
    }
    return { x: 3, y: 3 }
  }, [gridCols, gridRows, walkableGrid])

  const updateBotBehavior = useCallback(
    (bot: BotPlayer) => {
      const now = Date.now()
      const timeSinceLastAction = now - bot.lastAction

      // Different personalities have different action frequencies
      const actionInterval = {
        friendly: 8000,
        quiet: 15000,
        energetic: 5000,
        mysterious: 12000,
      }[bot.personality]

      if (timeSinceLastAction > actionInterval) {
        const actions = ["move", "dance", "sit", "wave", "laugh", "message"]
        const action = actions[Math.floor(Math.random() * actions.length)]

        switch (action) {
          case "move":
            const newPos = findRandomWalkablePosition()
            bot.x = newPos.x
            bot.y = newPos.y
            bot.facing = ["N", "S", "E", "W"][Math.floor(Math.random() * 4)] as "N" | "S" | "E" | "W"
            break

          case "dance":
            bot.dance = !bot.dance
            onBotAction?.(bot.id, { type: "dance", value: bot.dance })
            break

          case "sit":
            bot.sit = !bot.sit
            onBotAction?.(bot.id, { type: "sit", value: bot.sit })
            break

          case "wave":
            if (!bot.wave) {
              bot.wave = true
              onBotAction?.(bot.id, { type: "wave", value: true })
              setTimeout(() => {
                bot.wave = false
                onBotAction?.(bot.id, { type: "wave", value: false })
              }, 2000)
            }
            break

          case "laugh":
            if (!bot.laugh) {
              bot.laugh = true
              onBotAction?.(bot.id, { type: "laugh", value: true })
              setTimeout(() => {
                bot.laugh = false
                onBotAction?.(bot.id, { type: "laugh", value: false })
              }, 1800)
            }
            break

          case "message":
            const messages = BOT_MESSAGES[bot.personality]
            const message = messages[Math.floor(Math.random() * messages.length)]
            onBotMessage?.(bot.name, message)
            break
        }

        bot.lastAction = now
      }

      return bot
    },
    [findRandomWalkablePosition, onBotAction, onBotMessage],
  )

  useEffect(() => {
    // Initialize bots for the room
    const botCount = Math.floor(Math.random() * 3) + 2 // 2-4 bots
    const newBots: BotPlayer[] = []

    for (let i = 0; i < botCount; i++) {
      newBots.push(createBot(`bot_${room}_${i}`))
    }

    botsRef.current = newBots

    // Send initial messages
    setTimeout(() => {
      newBots.forEach((bot, index) => {
        setTimeout(
          () => {
            if (Math.random() > 0.5) {
              // 50% chance to send welcome message
              const messages = BOT_MESSAGES[bot.personality]
              const message = messages[Math.floor(Math.random() * messages.length)]
              onBotMessage?.(bot.name, message)
            }
          },
          index * 2000 + Math.random() * 3000,
        )
      })
    }, 1000)

    return () => {
      botsRef.current = []
    }
  }, [room, createBot, onBotMessage])

  useEffect(() => {
    const updateLoop = setInterval(() => {
      botsRef.current = botsRef.current.map(updateBotBehavior)
    }, 1000)

    return () => clearInterval(updateLoop)
  }, [updateBotBehavior])

  return botsRef.current
}

export default function BotPlayers(props: BotPlayersProps) {
  useBotPlayers(props)
  return null
}
