"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import PixelCityRoleplay from "./pixel-city-roleplay"
import BattleArena from "./battle-arena"
import CreativeBuilding from "./creative-building"

interface ExperienceLauncherProps {
  experienceId: string
  experienceName: string
  playerName: string
  onClose: () => void
  onSendMessage: (message: string) => void
}

export default function ExperienceLauncher({
  experienceId,
  experienceName,
  playerName,
  onClose,
  onSendMessage,
}: ExperienceLauncherProps) {
  const renderExperience = () => {
    switch (experienceId) {
      case "exp_0":
        return <PixelCityRoleplay playerName={playerName} onSendMessage={onSendMessage} />
      case "exp_1":
        return <BattleArena playerName={playerName} onSendMessage={onSendMessage} />
      case "exp_2":
        return <CreativeBuilding playerName={playerName} onSendMessage={onSendMessage} />
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">{experienceName}</div>
              <div className="text-sm text-gray-600 mb-4">This experience is coming soon! Stay tuned for updates.</div>
              <Button onClick={onClose}>Return to Browser</Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <div className="font-semibold text-sm">{experienceName}</div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Experience Content */}
      <div className="flex-1 overflow-hidden">{renderExperience()}</div>
    </div>
  )
}
