# Assets Directory

This directory contains all static assets for the Data Conversion App.

## Directory Structure

```
assets/
├── images/          # Static images (PNG, JPG, SVG, WebP)
├── video/           # Video files (MP4, WebM)
├── audio/           # Audio files (MP3, WAV, OGG)
├── documents/       # Documents and data files (PDF, JSON, CSV)
└── README.md        # This file
```

## Usage Guidelines

### Importing Assets
Always import assets explicitly rather than using string paths:

```typescript
// ✅ Correct - explicit import
import logoImage from '@/assets/images/logo.png'
import heroVideo from '@/assets/video/hero-background.mp4'
import clickSound from '@/assets/audio/button-click.mp3'

// Then use in JSX
<img src={logoImage} alt="Logo" />
<video src={heroVideo} />
<audio src={clickSound} />
```

```typescript
// ❌ Incorrect - string paths
<img src="@/assets/images/logo.png" />
<video src="/src/assets/video/hero-background.mp4" />
```

### File Naming Conventions
- Use kebab-case for filenames: `icon-calculator.svg`
- Be descriptive: `floating-point-diagram.png` vs `image1.png`
- Include size in filename when relevant: `logo-256x256.png`

### Optimization Guidelines
- **Images**: Use WebP format when possible for better compression
- **Videos**: Use MP4 with H.264 encoding for broad compatibility
- **Audio**: Use MP3 for music, WAV for short sound effects
- **Documents**: Keep file sizes reasonable for web delivery

## File Type Recommendations

### Images (`/images/`)
- **Icons**: SVG (scalable, small file size)
- **Photos**: WebP or JPG
- **Graphics**: PNG (for transparency), SVG (for scalable graphics)
- **Favicons**: ICO, PNG, SVG

### Video (`/video/`)
- **Primary**: MP4 (H.264/AAC encoding)
- **Fallback**: WebM (VP9/Opus encoding)
- **Optimization**: Keep under 10MB for web delivery

### Audio (`/audio/`)
- **UI Sounds**: WAV (short, high quality)
- **Background Music**: MP3 (compressed, smaller files)
- **Fallback**: OGG Vorbis

### Documents (`/documents/`)
- **Data Files**: JSON, CSV
- **Documentation**: PDF
- **Configuration**: JSON, YAML

## Examples for Data Conversion App

Suggested assets for your floating-point conversion app:

### Images
- `calculator-icon.svg` - App icon
- `binary-visualization.png` - Binary representation diagrams
- `fp-format-comparison.svg` - Floating-point format comparison chart
- `samsung-optimized-icon.png` - High-DPI app icon for Samsung devices

### Audio
- `conversion-complete.mp3` - Success sound when conversion completes
- `input-error.wav` - Error sound for invalid input
- `format-switch.mp3` - Subtle sound when switching formats

### Documents
- `fp-format-specs.json` - Detailed floating-point format specifications
- `conversion-examples.csv` - Sample conversion data for testing
- `app-help.pdf` - User documentation

## Mobile Optimization (Samsung Galaxy S24 Ultra)

For optimal performance on Samsung Galaxy S24 Ultra:
- Use high-DPI images (2x, 3x variants)
- Optimize for OLED display (true blacks, vibrant colors)
- Keep total asset bundle under 5MB for fast loading
- Use progressive JPEGs for large images
- Consider dark/light theme variants for images with text