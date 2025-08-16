"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Palette, Square, Circle, Triangle, Undo, Redo, Save, Share } from "lucide-react"

interface CreativeBuildingProps {
  playerName: string
  onSendMessage: (message: string) => void
}

export default function CreativeBuilding({ playerName, onSendMessage }: CreativeBuildingProps) {
  const [selectedTool, setSelectedTool] = useState("block")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [projectName, setProjectName] = useState("")
  const [builds, setBuilds] = useState<string[]>([])

  const tools = [
    { id: "block", name: "Block", icon: Square },
    { id: "circle", name: "Circle", icon: Circle },
    { id: "triangle", name: "Triangle", icon: Triangle },
    { id: "paint", name: "Paint", icon: Palette },
  ]

  const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#000000"]

  const materials = ["Wood", "Stone", "Metal", "Glass", "Brick", "Concrete", "Marble", "Crystal"]

  const handleSaveProject = () => {
    if (projectName.trim()) {
      setBuilds((prev) => [...prev, projectName])
      onSendMessage(`🏗️ ${playerName} completed building "${projectName}"!`)
      setProjectName("")
    }
  }

  const handleShareProject = () => {
    if (projectName.trim()) {
      onSendMessage(`🎨 ${playerName} shares their amazing creation: "${projectName}"! Come check it out!`)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-100 to-pink-100">
      {/* Tool Bar */}
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Creative Mode</Badge>
            <Badge variant="secondary">{builds.length} Builds</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Undo className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2 mb-3">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool(tool.id)}
                className="flex items-center gap-1 text-xs"
              >
                <Icon className="w-3 h-3" />
                {tool.name}
              </Button>
            )
          })}
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Color:</span>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded border-2 ${selectedColor === color ? "border-gray-800" : "border-gray-300"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Building Canvas Area */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 h-48 mb-4 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Square className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Building Canvas</div>
            <div className="text-xs">Use tools to create your masterpiece!</div>
          </div>
        </div>

        {/* Materials */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Materials</h3>
          <div className="grid grid-cols-4 gap-2">
            {materials.map((material) => (
              <Button
                key={material}
                variant="outline"
                size="sm"
                onClick={() => onSendMessage(`🔨 ${playerName} is using ${material} blocks!`)}
                className="text-xs"
              >
                {material}
              </Button>
            ))}
          </div>
        </div>

        {/* Project Management */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold mb-2">Project Name</h3>
            <Input
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveProject} disabled={!projectName.trim()} className="flex-1 text-xs">
              <Save className="w-3 h-3 mr-1" />
              Save Build
            </Button>
            <Button
              onClick={handleShareProject}
              disabled={!projectName.trim()}
              variant="outline"
              className="flex-1 text-xs bg-transparent"
            >
              <Share className="w-3 h-3 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Recent Builds */}
        {builds.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Your Builds</h3>
            <div className="space-y-1">
              {builds.slice(-3).map((build, index) => (
                <div key={index} className="text-xs p-2 bg-white rounded border">
                  🏗️ {build}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
