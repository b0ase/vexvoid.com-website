// Glitch Effects Library for V3XV0ID
// Digital corruption and distortion effects

export interface GlitchEffect {
  id: string
  name: string
  intensity: number
  duration: number
  type: 'visual' | 'data' | 'color' | 'motion'
}

export const glitchEffects: GlitchEffect[] = [
  {
    id: 'rgb-separation',
    name: 'RGB Channel Separation',
    intensity: 0.7,
    duration: 500,
    type: 'color'
  },
  {
    id: 'pixel-sort',
    name: 'Pixel Sorting',
    intensity: 0.8,
    duration: 800,
    type: 'visual'
  },
  {
    id: 'data-corruption',
    name: 'Data Corruption',
    intensity: 0.6,
    duration: 300,
    type: 'data'
  },
  {
    id: 'scan-lines',
    name: 'Scan Line Distortion',
    intensity: 0.5,
    duration: 1000,
    type: 'visual'
  },
  {
    id: 'chromatic-aberration',
    name: 'Chromatic Aberration',
    intensity: 0.9,
    duration: 600,
    type: 'color'
  },
  {
    id: 'digital-noise',
    name: 'Digital Noise',
    intensity: 0.4,
    duration: 400,
    type: 'data'
  },
  {
    id: 'frame-displacement',
    name: 'Frame Displacement',
    intensity: 0.8,
    duration: 200,
    type: 'motion'
  }
]

// Apply glitch effect to canvas context
export const applyGlitchEffect = (
  ctx: CanvasRenderingContext2D,
  effect: GlitchEffect,
  width: number,
  height: number,
  time: number
) => {
  const intensity = effect.intensity * (0.5 + Math.random() * 0.5)
  
  switch (effect.id) {
    case 'rgb-separation':
      applyRGBSeparation(ctx, width, height, intensity)
      break
    case 'pixel-sort':
      applyPixelSort(ctx, width, height, intensity)
      break
    case 'data-corruption':
      applyDataCorruption(ctx, width, height, intensity)
      break
    case 'scan-lines':
      applyScanLines(ctx, width, height, intensity, time)
      break
    case 'chromatic-aberration':
      applyChromaticAberration(ctx, width, height, intensity)
      break
    case 'digital-noise':
      applyDigitalNoise(ctx, width, height, intensity)
      break
    case 'frame-displacement':
      applyFrameDisplacement(ctx, width, height, intensity)
      break
  }
}

// RGB Channel Separation - Subtle Black and White
const applyRGBSeparation = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
  const offset = intensity * 3 // Much smaller offset for subtlety
  
  // Very subtle monochrome separation
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  
  // Light gray channel - very subtle
  ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.1})`
  ctx.fillRect(-offset, 0, width, height)
  
  // Dark gray channel - very subtle
  ctx.fillStyle = `rgba(0, 0, 0, ${intensity * 0.15})`
  ctx.fillRect(offset * 0.5, 0, width, height)
  
  // Rare tiny color hint - only 2% chance
  if (Math.random() < 0.02) {
    ctx.fillStyle = `rgba(255, 0, 0, ${intensity * 0.05})`
    ctx.fillRect(offset, 0, width, height)
  }
  ctx.restore()
}

// Pixel Sorting Effect
const applyPixelSort = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  
  // Sort pixels in horizontal strips
  const stripHeight = Math.floor(intensity * 20) + 1
  for (let y = 0; y < height; y += stripHeight) {
    for (let strip = 0; strip < stripHeight && y + strip < height; strip++) {
      const row = y + strip
      const rowData = []
      
      // Extract row pixels
      for (let x = 0; x < width; x++) {
        const index = (row * width + x) * 4
        rowData.push({
          r: data[index],
          g: data[index + 1],
          b: data[index + 2],
          a: data[index + 3],
          brightness: (data[index] + data[index + 1] + data[index + 2]) / 3
        })
      }
      
      // Sort by brightness
      rowData.sort((a, b) => a.brightness - b.brightness)
      
      // Put back sorted pixels
      for (let x = 0; x < width; x++) {
        const index = (row * width + x) * 4
        const pixel = rowData[x]
        data[index] = pixel.r
        data[index + 1] = pixel.g
        data[index + 2] = pixel.b
        data[index + 3] = pixel.a
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
}

// Data Corruption - Very subtle black and white blocks
const applyDataCorruption = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
  const corruptionBlocks = Math.floor(intensity * 15) // Much fewer blocks
  
  for (let i = 0; i < corruptionBlocks; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const w = Math.random() * 20 * intensity // Much smaller blocks
    const h = Math.random() * 3 * intensity // Thin lines
    
    ctx.save()
    ctx.globalCompositeOperation = 'difference'
    
    // 95% black and white, 5% subtle color
    if (Math.random() < 0.95) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)'
    } else {
      // Very subtle color corruption
      ctx.fillStyle = `rgba(255, 0, 0, 0.1)`
    }
    ctx.fillRect(x, y, w, h)
    ctx.restore()
  }
}

// Scan Lines
const applyScanLines = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number, time: number) => {
  const lineSpacing = 3
  const offset = (time * 100) % (lineSpacing * 2)
  
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  ctx.strokeStyle = `rgba(255, 255, 255, ${1 - intensity * 0.3})`
  ctx.lineWidth = 1
  
  for (let y = -offset; y < height + lineSpacing; y += lineSpacing) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  ctx.restore()
}

// Chromatic Aberration
const applyChromaticAberration = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const aberrationData = new Uint8ClampedArray(data)
  
  const offset = Math.floor(intensity * 5)
  
  // Shift red and blue channels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      
      // Red channel shift
      const redX = Math.max(0, Math.min(width - 1, x - offset))
      const redIndex = (y * width + redX) * 4
      aberrationData[index] = data[redIndex]
      
      // Blue channel shift
      const blueX = Math.max(0, Math.min(width - 1, x + offset))
      const blueIndex = (y * width + blueX) * 4
      aberrationData[index + 2] = data[blueIndex + 2]
    }
  }
  
  const newImageData = new ImageData(aberrationData, width, height)
  ctx.putImageData(newImageData, 0, 0)
}

// Digital Noise - Very subtle black and white pixels
const applyDigitalNoise = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
  const noiseData = ctx.createImageData(width, height)
  const data = noiseData.data
  
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < intensity * 0.05) { // Much less noise
      // 98% black and white noise
      if (Math.random() < 0.98) {
        const noise = Math.random() < 0.5 ? 0 : 255
        data[i] = noise     // Red
        data[i + 1] = noise // Green
        data[i + 2] = noise // Blue
        data[i + 3] = 80    // Low alpha for subtlety
      } else {
        // Very rare, very subtle color
        data[i] = 255
        data[i + 1] = 0
        data[i + 2] = 0
        data[i + 3] = 30
      }
    } else {
      data[i + 3] = 0 // Transparent
    }
  }
  
  ctx.save()
  ctx.globalCompositeOperation = 'overlay'
  ctx.putImageData(noiseData, 0, 0)
  ctx.restore()
}

// Frame Displacement
const applyFrameDisplacement = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
  const displacement = intensity * 20
  const segments = 5
  const segmentHeight = height / segments
  
  for (let i = 0; i < segments; i++) {
    const y = i * segmentHeight
    const offset = (Math.random() - 0.5) * displacement
    
    const imageData = ctx.getImageData(0, y, width, segmentHeight)
    ctx.clearRect(0, y, width, segmentHeight)
    ctx.putImageData(imageData, offset, y)
  }
}

// Get random glitch effect
export const getRandomGlitchEffect = (): GlitchEffect => {
  return glitchEffects[Math.floor(Math.random() * glitchEffects.length)]
}

// Combine multiple glitch effects
export const applyMultipleGlitchEffects = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  count: number = 2
) => {
  const effects = []
  for (let i = 0; i < count; i++) {
    effects.push(getRandomGlitchEffect())
  }
  
  effects.forEach(effect => {
    applyGlitchEffect(ctx, effect, width, height, time)
  })
} 