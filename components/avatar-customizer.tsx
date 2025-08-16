"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shuffle, Save, RotateCcw } from "lucide-react"
import {
  type AvatarCustomization,
  AVATAR_PRESETS,
  DEFAULT_CUSTOMIZATION,
  generateRandomCustomization,
  saveCustomization,
} from "@/lib/avatar-customization"

interface AvatarCustomizerProps {
  customization: AvatarCustomization
  onChange: (customization: AvatarCustomization) => void
  onSave?: () => void
}

export default function AvatarCustomizer({ customization, onChange, onSave }: AvatarCustomizerProps) {
  const [activeTab, setActiveTab] = useState<"appearance" | "clothing" | "accessories">("appearance")

  const handleChange = (key: keyof AvatarCustomization, value: any) => {
    onChange({ ...customization, [key]: value })
  }

  const handleRandomize = () => {
    onChange(generateRandomCustomization())
  }

  const handleReset = () => {
    onChange(DEFAULT_CUSTOMIZATION)
  }

  const handleSave = () => {
    saveCustomization(customization)
    onSave?.()
  }

  const ColorPicker = ({
    colors,
    selected,
    onSelect,
  }: {
    colors: { name: string; color: string }[]
    selected: string
    onSelect: (color: string) => void
  }) => (
    <div className="grid grid-cols-4 gap-2">
      {colors.map((color) => (
        <button
          key={color.color}
          className={`w-8 h-8 rounded-full border-2 transition-all ${
            selected === color.color ? "border-black scale-110 shadow-lg" : "border-gray-300 hover:border-gray-500"
          }`}
          style={{ backgroundColor: color.color }}
          onClick={() => onSelect(color.color)}
          title={color.name}
        />
      ))}
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "appearance", label: "Appearance" },
          { id: "clothing", label: "Clothing" },
          { id: "accessories", label: "Accessories" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Skin Tone</h3>
            <ColorPicker
              colors={AVATAR_PRESETS.skinTones}
              selected={customization.skinTone}
              onSelect={(color) => handleChange("skinTone", color)}
            />
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Hair Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {(["short", "long", "curly", "spiky", "bald"] as const).map((style) => (
                <button
                  key={style}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    customization.hairStyle === style
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleChange("hairStyle", style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Hair Color</h3>
            <ColorPicker
              colors={AVATAR_PRESETS.hairColors}
              selected={customization.hairColor}
              onSelect={(color) => handleChange("hairColor", color)}
            />
          </Card>
        </div>
      )}

      {/* Clothing Tab */}
      {activeTab === "clothing" && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Shirt Color</h3>
            <ColorPicker
              colors={AVATAR_PRESETS.shirtColors}
              selected={customization.shirtColor}
              onSelect={(color) => handleChange("shirtColor", color)}
            />
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Pants Color</h3>
            <ColorPicker
              colors={AVATAR_PRESETS.pantsColors}
              selected={customization.pantsColor}
              onSelect={(color) => handleChange("pantsColor", color)}
            />
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Shoe Color</h3>
            <ColorPicker
              colors={AVATAR_PRESETS.shoeColors}
              selected={customization.shoeColor}
              onSelect={(color) => handleChange("shoeColor", color)}
            />
          </Card>
        </div>
      )}

      {/* Accessories Tab */}
      {activeTab === "accessories" && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Accessory</h3>
            <div className="grid grid-cols-2 gap-2">
              {(["none", "glasses", "hat", "necklace"] as const).map((accessory) => (
                <button
                  key={accessory}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    customization.accessory === accessory
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleChange("accessory", accessory)}
                >
                  {accessory === "none" ? "None" : accessory.charAt(0).toUpperCase() + accessory.slice(1)}
                </button>
              ))}
            </div>
          </Card>

          {customization.accessory !== "none" && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Accessory Color</h3>
              <ColorPicker
                colors={AVATAR_PRESETS.accessoryColors}
                selected={customization.accessoryColor || AVATAR_PRESETS.accessoryColors[0].color}
                onSelect={(color) => handleChange("accessoryColor", color)}
              />
            </Card>
          )}
        </div>
      )}

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleRandomize} variant="outline" size="sm" className="flex-1 bg-transparent">
          <Shuffle className="w-4 h-4 mr-2" />
          Randomize
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm" className="flex-1 bg-transparent">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} size="sm" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  )
}
