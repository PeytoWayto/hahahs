import type { AvatarCustomization } from "./avatar-customization"

export function drawCustomAvatar(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  tileW: number,
  tileH: number,
  facing: "N" | "S" | "E" | "W",
  t: number,
  moving: boolean,
  customization: AvatarCustomization,
  dancing?: boolean,
  sitting?: boolean,
  waving?: boolean,
  laughing?: boolean,
) {
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)"
  ctx.beginPath()
  ctx.ellipse(ax, ay + tileH * 0.6, tileW * 0.22, tileH * 0.22, 0, 0, Math.PI * 2)
  ctx.fill()

  const walkSwing = Math.sin(t * 6) * (moving ? 3 : 1)
  const armSwing = Math.sin(t * 6 + Math.PI) * (moving ? 5 : 2)
  const dancePhase = dancing ? t * 8 : 0
  const danceBob = dancing ? Math.sin(dancePhase) * 2 : 0
  const danceArm = dancing ? Math.sin(dancePhase * 1.5) * 7 : 0
  const waveShimmy = waving ? Math.sin(t * 10) * 3 : 0
  const laughJitter = laughing ? Math.sin(t * 20) * 1.5 : 0

  if (sitting) {
    // Shoes
    rect(ctx, ax - 7, ay + 10, 7, 4, customization.shoeColor)
    rect(ctx, ax + 0, ay + 10, 7, 4, customization.shoeColor)

    // Pants (visible part when sitting)
    rect(ctx, ax - 10, ay + 2, 20, 8, customization.pantsColor)

    // Shirt
    rounded(ctx, ax - 10, ay - 12, 20, 20, 6, customization.shirtColor, true)

    // Arms
    rounded(ctx, ax - 13, ay - 6, 6, 12, 3, customization.skinTone, true)
    rounded(ctx, ax + 7, ay - 6, 6, 12, 3, customization.skinTone, true)

    // Head
    circle(ctx, ax, ay - 20, 12, customization.skinTone)

    // Hair
    drawHair(ctx, ax, ay - 20, customization.hairStyle, customization.hairColor, facing)

    // Accessories
    if (customization.accessory !== "none") {
      drawAccessory(ctx, ax, ay - 20, customization.accessory, customization.accessoryColor || "#000000", facing)
    }

    // Outlines
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(ax, ay - 20, 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeRect(Math.round(ax - 10) + 0.5, Math.round(ay - 12) + 0.5, 20, 20)

    drawFace(ctx, facing, ax, ay - 20, false)
    return
  }

  // Standing/walking avatar
  // Shoes
  rect(ctx, ax - 6, ay + 8 + (dancing ? 0 : walkSwing * -0.3), 6, 10, customization.shoeColor)
  rect(ctx, ax + 1, ay + 8 + (dancing ? 0 : walkSwing * 0.3), 6, 10, customization.shoeColor)
  rect(ctx, ax - 7, ay + 17 + (dancing ? 0 : walkSwing * -0.3), 8, 3, darkenColor(customization.shoeColor))
  rect(ctx, ax + 0, ay + 17 + (dancing ? 0 : walkSwing * 0.3), 8, 3, darkenColor(customization.shoeColor))

  // Pants
  rect(ctx, ax - 8, ay - 2 + danceBob + laughJitter, 16, 12, customization.pantsColor)

  // Shirt
  rounded(ctx, ax - 10, ay - 18 + danceBob + laughJitter, 20, 26, 6, customization.shirtColor, true)
  rect(ctx, ax - 6, ay - 18 + danceBob + laughJitter, 12, 3, "#ffffff")
  rect(ctx, ax - 6, ay - 15 + danceBob + laughJitter, 12, 2, "#cbd5e1")

  // Arms
  rounded(
    ctx,
    ax - 13,
    ay - 12 + (dancing ? -danceArm : armSwing * -0.15) + danceBob + laughJitter,
    6,
    14,
    3,
    customization.skinTone,
    true,
  )
  if (waving) {
    rounded(ctx, ax + 7, ay - 24 + waveShimmy + danceBob + laughJitter, 6, 14, 3, customization.skinTone, true)
    rect(ctx, ax + 10, ay - 28 + waveShimmy + danceBob + laughJitter, 4, 4, "#fde68a")
  } else {
    rounded(
      ctx,
      ax + 7,
      ay - 12 + (dancing ? danceArm : armSwing * 0.15) + danceBob + laughJitter,
      6,
      14,
      3,
      customization.skinTone,
      true,
    )
  }

  // Head
  circle(ctx, ax, ay - 26 + danceBob + laughJitter, 12, customization.skinTone)

  // Hair
  drawHair(ctx, ax, ay - 26 + danceBob + laughJitter, customization.hairStyle, customization.hairColor, facing)

  // Accessories
  if (customization.accessory !== "none") {
    drawAccessory(
      ctx,
      ax,
      ay - 26 + danceBob + laughJitter,
      customization.accessory,
      customization.accessoryColor || "#000000",
      facing,
    )
  }

  // Outlines
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(ax, ay - 26 + danceBob + laughJitter, 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeRect(Math.round(ax - 10) + 0.5, Math.round(ay - 18 + danceBob + laughJitter) + 0.5, 20, 26)

  drawFace(ctx, facing, ax, ay - 26 + danceBob + laughJitter, laughing)
}

function drawHair(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  style: string,
  color: string,
  facing: "N" | "S" | "E" | "W",
) {
  ctx.fillStyle = color

  switch (style) {
    case "short":
      rounded(ctx, cx - 12, cy - 12, 24, 10, 6, color, true)
      rect(ctx, cx - 12, cy - 7, 24, 5, color)
      break
    case "long":
      rounded(ctx, cx - 12, cy - 12, 24, 10, 6, color, true)
      rect(ctx, cx - 12, cy - 7, 24, 8, color)
      rect(ctx, cx - 8, cy + 1, 16, 6, color)
      break
    case "curly":
      circle(ctx, cx - 8, cy - 8, 6, color)
      circle(ctx, cx + 8, cy - 8, 6, color)
      circle(ctx, cx, cy - 10, 7, color)
      break
    case "spiky":
      for (let i = -2; i <= 2; i++) {
        const x = cx + i * 5
        ctx.beginPath()
        ctx.moveTo(x, cy - 12)
        ctx.lineTo(x - 2, cy - 4)
        ctx.lineTo(x + 2, cy - 4)
        ctx.closePath()
        ctx.fill()
      }
      rect(ctx, cx - 12, cy - 7, 24, 5, color)
      break
    case "bald":
      // No hair to draw
      break
  }
}

function drawAccessory(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  accessory: string,
  color: string,
  facing: "N" | "S" | "E" | "W",
) {
  ctx.fillStyle = color

  switch (accessory) {
    case "glasses":
      // Glasses frames
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx - 4, cy - 2, 4, 0, Math.PI * 2)
      ctx.arc(cx + 4, cy - 2, 4, 0, Math.PI * 2)
      ctx.stroke()
      // Bridge
      ctx.beginPath()
      ctx.moveTo(cx - 1, cy - 2)
      ctx.lineTo(cx + 1, cy - 2)
      ctx.stroke()
      break
    case "hat":
      // Hat
      rounded(ctx, cx - 14, cy - 16, 28, 8, 4, color, true)
      rect(ctx, cx - 10, cy - 12, 20, 4, color)
      break
    case "necklace":
      // Necklace (drawn lower on the body)
      ctx.beginPath()
      ctx.arc(cx, cy + 18, 3, 0, Math.PI * 2)
      ctx.fill()
      for (let i = -1; i <= 1; i++) {
        circle(ctx, cx + i * 4, cy + 16, 1, color)
      }
      break
  }
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  facing: "N" | "S" | "E" | "W",
  cx: number,
  cy: number,
  laughing: boolean,
) {
  ctx.fillStyle = "#000"
  if (facing === "E") {
    dot(ctx, cx + 4, cy - 2)
    dot(ctx, cx + 7, cy + 1)
  } else if (facing === "W") {
    dot(ctx, cx - 4, cy - 2)
    dot(ctx, cx - 7, cy + 1)
  } else if (facing === "N") {
    dot(ctx, cx - 3, cy - 4)
    dot(ctx, cx + 3, cy - 4)
  } else {
    dot(ctx, cx - 3, cy - 1)
    dot(ctx, cx + 3, cy - 1)
  }

  if (laughing) {
    ctx.fillStyle = "#7f1d1d"
    ctx.beginPath()
    ctx.ellipse(cx, cy + 4, 3.5, 2.5, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.strokeStyle = "#000"
    ctx.beginPath()
    ctx.moveTo(cx - 3, cy + 4)
    ctx.quadraticCurveTo(cx, cy + 6, cx + 3, cy + 4)
    ctx.stroke()
  }

  if (laughing) {
    ctx.font = "700 10px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
    ctx.fillStyle = "#111827"
    ctx.fillText("ha", cx + 10, cy - 6)
    ctx.fillText("ha", cx - 18, cy - 2)
  }
}

// Helper functions
function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
  fill: boolean,
) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  if (fill) ctx.fill()
  else ctx.stroke()
}

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillRect(x, y, 2, 2)
}

function darkenColor(color: string): string {
  // Simple color darkening - convert hex to RGB, darken, convert back
  const hex = color.replace("#", "")
  const r = Math.max(0, Number.parseInt(hex.substr(0, 2), 16) - 40)
  const g = Math.max(0, Number.parseInt(hex.substr(2, 2), 16) - 40)
  const b = Math.max(0, Number.parseInt(hex.substr(4, 2), 16) - 40)
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}
