"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Home, Briefcase, ShoppingBag, MapPin } from "lucide-react"

interface PixelCityRoleplayProps {
  playerName: string
  onSendMessage: (message: string) => void
}

export default function PixelCityRoleplay({ playerName, onSendMessage }: PixelCityRoleplayProps) {
  const [currentLocation, setCurrentLocation] = useState("Downtown Plaza")
  const [job, setJob] = useState<string | null>(null)
  const [money, setMoney] = useState(1000)
  const [inventory, setInventory] = useState<string[]>([])

  const locations = [
    { name: "Downtown Plaza", icon: MapPin, activities: ["Meet People", "Street Performance"] },
    { name: "Shopping Mall", icon: ShoppingBag, activities: ["Buy Items", "Window Shopping"] },
    { name: "Office District", icon: Briefcase, activities: ["Work", "Business Meeting"] },
    { name: "Residential Area", icon: Home, activities: ["Visit Friends", "House Party"] },
    { name: "Car Dealership", icon: Car, activities: ["Buy Car", "Test Drive"] },
  ]

  const jobs = ["Police Officer", "Doctor", "Teacher", "Business Owner", "Artist", "Chef"]

  const handleWork = () => {
    if (job) {
      const earnings = Math.floor(Math.random() * 200) + 100
      setMoney((prev) => prev + earnings)
      onSendMessage(`💼 ${playerName} earned $${earnings} working as a ${job}!`)
    }
  }

  const handleBuyItem = (item: string, cost: number) => {
    if (money >= cost) {
      setMoney((prev) => prev - cost)
      setInventory((prev) => [...prev, item])
      onSendMessage(`🛍️ ${playerName} bought a ${item} for $${cost}!`)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-100 to-green-100">
      {/* Status Bar */}
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{currentLocation}</Badge>
            {job && <Badge variant="secondary">{job}</Badge>}
          </div>
          <div className="text-sm font-semibold text-green-600">${money}</div>
        </div>
        <div className="text-xs text-gray-600">Inventory: {inventory.length > 0 ? inventory.join(", ") : "Empty"}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Location Selection */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Locations</h3>
          <div className="grid grid-cols-2 gap-2">
            {locations.map((location) => {
              const Icon = location.icon
              return (
                <Button
                  key={location.name}
                  variant={currentLocation === location.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentLocation(location.name)
                    onSendMessage(`📍 ${playerName} traveled to ${location.name}`)
                  }}
                  className="flex items-center gap-2 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  {location.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Job Selection */}
        {!job && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Choose Your Career</h3>
            <div className="grid grid-cols-2 gap-2">
              {jobs.map((jobOption) => (
                <Button
                  key={jobOption}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setJob(jobOption)
                    onSendMessage(`💼 ${playerName} became a ${jobOption}!`)
                  }}
                  className="text-xs"
                >
                  {jobOption}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Location Activities */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Activities at {currentLocation}</h3>
          <div className="space-y-2">
            {currentLocation === "Office District" && job && (
              <Button onClick={handleWork} className="w-full text-xs">
                Work as {job} (+$100-300)
              </Button>
            )}
            {currentLocation === "Shopping Mall" && (
              <div className="space-y-2">
                <Button onClick={() => handleBuyItem("Coffee", 5)} disabled={money < 5} className="w-full text-xs">
                  Buy Coffee ($5)
                </Button>
                <Button
                  onClick={() => handleBuyItem("New Outfit", 50)}
                  disabled={money < 50}
                  className="w-full text-xs"
                >
                  Buy New Outfit ($50)
                </Button>
                <Button onClick={() => handleBuyItem("Phone", 200)} disabled={money < 200} className="w-full text-xs">
                  Buy Phone ($200)
                </Button>
              </div>
            )}
            {currentLocation === "Downtown Plaza" && (
              <div className="space-y-2">
                <Button
                  onClick={() => onSendMessage(`🎭 ${playerName} is performing on the street!`)}
                  className="w-full text-xs"
                >
                  Street Performance
                </Button>
                <Button
                  onClick={() => onSendMessage(`👋 ${playerName} is meeting new people at the plaza!`)}
                  className="w-full text-xs"
                >
                  Meet People
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(`📱 ${playerName} is checking their phone`)}
              className="text-xs"
            >
              Check Phone
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(`🚗 ${playerName} is driving around the city`)}
              className="text-xs"
            >
              Drive Around
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
