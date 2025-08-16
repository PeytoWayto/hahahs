"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual"
import { Heart, Laugh, ThumbsUp, Gift, Crown, Zap } from "lucide-react"
import styles from "@/styles/habbo.module.css"

export type ChatMessage = {
  id: string
  author: string
  text: string
  timestamp: number
  type?: "normal" | "system" | "achievement" | "private"
  reactions?: { [emoji: string]: string[] } // emoji -> array of user names
  isVip?: boolean
  level?: number
}

type Props = {
  messages?: ChatMessage[]
  onSend?: (text: string) => void
  onReaction?: (messageId: string, emoji: string) => void
  placeholder?: string
  maxLength?: number
  currentUser?: string
}

const DEFAULT_MAX_LEN = 240

const QUICK_REACTIONS = [
  { emoji: "❤️", icon: Heart, label: "Love" },
  { emoji: "😂", icon: Laugh, label: "Funny" },
  { emoji: "👍", icon: ThumbsUp, label: "Like" },
  { emoji: "🎁", icon: Gift, label: "Gift" },
  { emoji: "⚡", icon: Zap, label: "Wow" },
]

const CHAT_COMMANDS = [
  "/dance - Toggle dancing",
  "/sit - Sit down",
  "/party - Start party mode",
  "/wave - Wave at others",
  "/laugh - Laugh emote",
  "/me [action] - Roleplay action",
  "/whisper [user] [message] - Private message",
  "/friend [user] - Send friend request",
]

export default function EnhancedChatPanel({
  messages = [],
  onSend,
  onReaction,
  placeholder = "Type a message...",
  maxLength = DEFAULT_MAX_LEN,
  currentUser = "You",
}: Props) {
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showCommands, setShowCommands] = useState(false)
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const atBottomRef = useRef(true)
  const [atBottom, setAtBottom] = useState(true)

  const sorted = useMemo(() => [...messages].sort((a, b) => a.timestamp - b.timestamp), [messages])

  const estimate = useCallback(() => 48, [])
  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: estimate,
    overscan: 12,
    measureElement: (el) => el?.getBoundingClientRect().height || 48,
  })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4
      atBottomRef.current = nearBottom
      setAtBottom(nearBottom)
    }
    onScroll()
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!sorted.length) return
    if (atBottomRef.current) {
      virtualizer.scrollToIndex(sorted.length - 1, { align: "end" })
    }
  }, [sorted.length, virtualizer])

  const handleReaction = useCallback(
    (messageId: string, emoji: string) => {
      onReaction?.(messageId, emoji)
    },
    [onReaction],
  )

  const processMessage = useCallback((text: string) => {
    // Handle special commands
    if (text.startsWith("/me ")) {
      return { text: `*${text.slice(4)}*`, type: "action" as const }
    }
    if (text.startsWith("/whisper ")) {
      const parts = text.slice(9).split(" ")
      const target = parts[0]
      const message = parts.slice(1).join(" ")
      return { text: `(whispers to ${target}): ${message}`, type: "whisper" as const }
    }
    return { text, type: "normal" as const }
  }, [])

  function submit() {
    const trimmed = text.trim()
    setError(null)
    setShowCommands(false)

    if (!trimmed) {
      setError("Message cannot be empty.")
      return
    }
    if (trimmed.length > maxLength) {
      setError(`Message is too long. Max ${maxLength} characters.`)
      return
    }

    const processed = processMessage(trimmed)
    onSend?.(processed.text)
    setText("")
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMessageStyle = (message: ChatMessage) => {
    switch (message.type) {
      case "system":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "achievement":
        return "bg-purple-50 border-purple-200 text-purple-800"
      case "private":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-white/90 border-black/15"
    }
  }

  return (
    <div className={styles.windowBody}>
      <div className="px-3 py-2 text-[12px] text-black/70 flex items-center justify-between">
        <span>Welcome to the enhanced chat!</span>
        <Button size="sm" variant="ghost" className="text-xs h-6" onClick={() => setShowCommands(!showCommands)}>
          Commands
        </Button>
      </div>

      {showCommands && (
        <div className="px-3 pb-2">
          <div className="bg-gray-50 rounded p-2 text-xs">
            <div className="font-semibold mb-1">Chat Commands:</div>
            <div className="grid grid-cols-1 gap-1">
              {CHAT_COMMANDS.map((cmd, i) => (
                <div key={i} className="text-gray-600">
                  {cmd}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-3">
        <div className="h-px bg-black/20" />
      </div>

      <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-0">
        <div style={{ height: virtualizer.getTotalSize() }} className="relative">
          {virtualizer.getVirtualItems().map((vi: VirtualItem) => {
            const m = sorted[vi.index]
            const hasReactions = m.reactions && Object.keys(m.reactions).length > 0

            return (
              <div
                key={m.id}
                ref={(el) => {
                  if (el) virtualizer.measureElement(el)
                }}
                className="absolute left-0 right-0 px-3"
                style={{ transform: `translateY(${vi.start}px)` }}
                onMouseEnter={() => setHoveredMessage(m.id)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <div className="py-1.5 leading-snug group">
                  <div className={`inline-block max-w-[92%] border rounded px-2 py-1 relative ${getMessageStyle(m)}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-semibold text-[12px] flex items-center gap-1">
                        {m.isVip && <Crown className="w-3 h-3 text-yellow-500" />}
                        {m.author}
                        {m.level && <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">L{m.level}</span>}
                      </span>
                      <span className="text-[10px] text-gray-500">{formatTimestamp(m.timestamp)}</span>
                    </div>
                    <span className="text-[13px] whitespace-pre-wrap break-words">{m.text}</span>

                    {/* Reactions */}
                    {hasReactions && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(m.reactions!).map(([emoji, users]) => (
                          <button
                            key={emoji}
                            className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 flex items-center gap-1 transition-colors"
                            onClick={() => handleReaction(m.id, emoji)}
                            title={`${users.join(", ")} reacted with ${emoji}`}
                          >
                            <span>{emoji}</span>
                            <span className="text-gray-600">{users.length}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Quick reaction buttons on hover */}
                    {hoveredMessage === m.id && m.author !== currentUser && (
                      <div className="absolute -top-8 left-0 bg-white border rounded-lg shadow-lg p-1 flex gap-1 z-10">
                        {QUICK_REACTIONS.map((reaction) => (
                          <button
                            key={reaction.emoji}
                            className="p-1 hover:bg-gray-100 rounded text-sm transition-colors"
                            onClick={() => handleReaction(m.id, reaction.emoji)}
                            title={reaction.label}
                          >
                            {reaction.emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!atBottom && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <Button
              size="sm"
              className={styles.goButton}
              onClick={() => virtualizer.scrollToIndex(sorted.length - 1, { align: "end" })}
            >
              Jump to latest
            </Button>
          </div>
        )}
      </div>

      <form
        className="p-3 flex flex-col gap-2 border-t border-black/15"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (error) setError(null)
            }}
            placeholder={placeholder}
            aria-label="Chat input"
            className={styles.pixelInput}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === "Enter" && (e.shiftKey || e.altKey)) {
                setText((t) => t + "\n")
                e.preventDefault()
              }
            }}
            maxLength={maxLength + 10}
          />
          <Button type="submit" className={styles.goButton}>
            Send
          </Button>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-black/50">Max {maxLength} chars • Try /dance, /me, /whisper</span>
          {error ? <span className="text-red-600 font-medium">{error}</span> : null}
        </div>
      </form>
    </div>
  )
}
