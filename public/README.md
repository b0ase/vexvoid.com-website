# Media Assets Structure

This directory contains all static media assets for the V3XV0ID website.

## Directory Structure

```
public/
├── images/
│   ├── photographs/     # Personal and event photos
│   ├── graphics/        # General graphics and artwork
│   ├── logos/          # Brand logos and variations
│   ├── album-covers/   # Full album artwork
│   ├── single-covers/  # Single/EP artwork
│   ├── decals/         # Sticker designs and decals
│   └── motifs/         # Recurring design elements
└── videos/             # Video content
```

## Usage Guidelines

### Image Naming Conventions
- Use lowercase letters
- Use hyphens (-) for spaces
- Include dimensions in filename for different sizes (e.g., `logo-500x500.png`)
- Use descriptive names (e.g., `album-cover-cyberpunk-2024.jpg`)

### Image Optimization
- Store original high-resolution versions
- Use Next.js Image component for automatic optimization
- Example usage:
```jsx
import Image from 'next/image'

<Image 
  src="/images/album-covers/album-name.jpg"
  alt="Album Cover"
  width={500}
  height={500}
/>
```

### Video Guidelines
- Store original high-quality versions
- Consider adding thumbnails in a `thumbnails` subdirectory
- Use consistent naming conventions
- Supported formats: MP4, WebM

### File Types
- Images: JPG, PNG, WebP, SVG
- Videos: MP4, WebM
- Graphics: SVG, PNG

### Best Practices
1. Always include alt text for images
2. Optimize images before committing
3. Keep file sizes reasonable
4. Use appropriate image formats (WebP for photos, SVG for logos)
5. Maintain consistent aspect ratios for similar content 