---
"@pr-pilot/core": patch
"@pr-pilot/ui": minor
---

## Core Package Fixes

### Configuration System Improvements
- **Fixed**: Changed config format from TypeScript to JSON (`.pr-pilotrc.json`) to avoid TypeScript dependency issues when using `npx`
- **Fixed**: Removed invalid import statement `import { defineConfig } from "pr-pilot"` that caused errors
- **Fixed**: Moved TypeScript to optional peer dependency - only required if users want TypeScript config files
- **Improved**: Prioritized JSON config formats in cosmiconfig search order
- **Updated**: All documentation and examples to use JSON format by default

### Breaking Changes
- Config file changed from `pr-pilot.config.ts` to `.pr-pilotrc.json`
- Users with existing TypeScript configs can still use them if they have `@pr-pilot/core` installed locally

## UI Package Optimization

### Massive Size Reduction: 113 MB → 7.4 MB (93% smaller!)
- **Implemented**: Next.js standalone server architecture (inspired by `check-site-meta`)
- **Added**: New bin script that spawns standalone server as child process
- **Added**: Build preparation script to optimize package structure
- **Improved**: Package now only ships compiled standalone server, not source files
- **Added**: Interactive browser opening prompt
- **Added**: Port and host configuration options

### Technical Changes
- Created `bin/pr-pilot-ui.ts` with proper server spawning logic
- Added `scripts/prepare-publish.js` to organize build artifacts
- Updated package files to only include `dist/` folder
- Removed unnecessary dependencies from published package

### Results
- Package size: 113 MB → 7.4 MB
- Unpacked size: ~400 MB → 28.3 MB  
- Files: 3000+ → 781
- Faster installation and better npx performance
