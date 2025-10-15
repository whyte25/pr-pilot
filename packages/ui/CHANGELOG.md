# @pr-pilot/ui

## 0.3.1

### Patch Changes

- 866e184: Fix UI git operations when running via npx
  - Fixed "Not a git repository" error when running UI via npx
  - UI now correctly uses the user's working directory instead of the package installation directory
  - Added PR_PILOT_CWD environment variable to pass user's directory to the server
  - Updated git service to use the correct working directory for all git operations

## 0.3.0

### Minor Changes

- cc2e948: ## Core Package Fixes

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

### Patch Changes

- Updated dependencies [cc2e948]
  - @pr-pilot/core@1.2.3

## 0.2.0

### Minor Changes

- Fix critical npx usage issues and add UI improvements

  **Core (@pr-pilot/core):**
  - Fix TypeScript dependency (moved to dependencies for npx users)
  - Fix config generation to not require @pr-pilot/core import
  - Fix scope detection to only detect from monorepo structure
  - Fix import statements from 'pr-pilot' to '@pr-pilot/core'
  - Improve error messages for scope detection

  **UI (@pr-pilot/ui):**
  - Add CLI entry point with bin/pr-pilot-ui.js
  - Add --port flag support (e.g., --port=4000)
  - Add help flag (-h, --help)
  - Optimize build process (build once, reuse)
  - Include pre-built files in npm package

  **Breaking Changes:** None

### Patch Changes

- Updated dependencies
  - @pr-pilot/core@1.2.2
