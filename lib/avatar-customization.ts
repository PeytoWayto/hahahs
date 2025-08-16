export type AvatarCustomization = {
  skinTone: string
  hairStyle: "short" | "long" | "curly" | "spiky" | "bald"
  hairColor: string
  shirtColor: string
  pantsColor: string
  shoeColor: string
  accessory?: "glasses" | "hat" | "necklace" | "none"
  accessoryColor?: string
}

export const AVATAR_PRESETS = {
  skinTones: [
    { name: "Light", color: "#f59e0b" },
    { name: "Medium", color: "#d97706" },
    { name: "Tan", color: "#b45309" },
    { name: "Dark", color: "#92400e" },
    { name: "Deep", color: "#78350f" },
  ],
  hairColors: [
    { name: "Blonde", color: "#fbbf24" },
    { name: "Brown", color: "#92400e" },
    { name: "Black", color: "#1f2937" },
    { name: "Red", color: "#dc2626" },
    { name: "Blue", color: "#2563eb" },
    { name: "Pink", color: "#ec4899" },
    { name: "Green", color: "#059669" },
    { name: "Purple", color: "#7c3aed" },
  ],
  shirtColors: [
    { name: "Blue", color: "#3b82f6" },
    { name: "Red", color: "#ef4444" },
    { name: "Green", color: "#10b981" },
    { name: "Purple", color: "#8b5cf6" },
    { name: "Orange", color: "#f59e0b" },
    { name: "Pink", color: "#ec4899" },
    { name: "Teal", color: "#14b8a6" },
    { name: "Gray", color: "#6b7280" },
  ],
  pantsColors: [
    { name: "Blue Jeans", color: "#1e40af" },
    { name: "Black", color: "#1f2937" },
    { name: "Brown", color: "#92400e" },
    { name: "Gray", color: "#4b5563" },
    { name: "Khaki", color: "#a3a3a3" },
    { name: "White", color: "#f9fafb" },
  ],
  shoeColors: [
    { name: "Black", color: "#1a1a1a" },
    { name: "Brown", color: "#78350f" },
    { name: "White", color: "#f9fafb" },
    { name: "Red", color: "#dc2626" },
    { name: "Blue", color: "#2563eb" },
  ],
  accessoryColors: [
    { name: "Black", color: "#1f2937" },
    { name: "Brown", color: "#92400e" },
    { name: "Gold", color: "#f59e0b" },
    { name: "Silver", color: "#9ca3af" },
    { name: "Red", color: "#dc2626" },
    { name: "Blue", color: "#2563eb" },
  ],
}

export const DEFAULT_CUSTOMIZATION: AvatarCustomization = {
  skinTone: AVATAR_PRESETS.skinTones[0].color,
  hairStyle: "short",
  hairColor: AVATAR_PRESETS.hairColors[1].color,
  shirtColor: AVATAR_PRESETS.shirtColors[0].color,
  pantsColor: AVATAR_PRESETS.pantsColors[0].color,
  shoeColor: AVATAR_PRESETS.shoeColors[0].color,
  accessory: "none",
}

export function getStoredCustomization(): AvatarCustomization {
  try {
    const stored = localStorage.getItem("avatar_customization")
    if (stored) {
      return { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("Failed to load avatar customization:", error)
  }
  return DEFAULT_CUSTOMIZATION
}

export function saveCustomization(customization: AvatarCustomization) {
  try {
    localStorage.setItem("avatar_customization", JSON.stringify(customization))
  } catch (error) {
    console.error("Failed to save avatar customization:", error)
  }
}

export function generateRandomCustomization(): AvatarCustomization {
  const randomChoice = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)]

  return {
    skinTone: randomChoice(AVATAR_PRESETS.skinTones).color,
    hairStyle: randomChoice(["short", "long", "curly", "spiky"]),
    hairColor: randomChoice(AVATAR_PRESETS.hairColors).color,
    shirtColor: randomChoice(AVATAR_PRESETS.shirtColors).color,
    pantsColor: randomChoice(AVATAR_PRESETS.pantsColors).color,
    shoeColor: randomChoice(AVATAR_PRESETS.shoeColors).color,
    accessory: Math.random() > 0.5 ? randomChoice(["glasses", "hat", "necklace"]) : "none",
    accessoryColor: randomChoice(AVATAR_PRESETS.accessoryColors).color,
  }
}
