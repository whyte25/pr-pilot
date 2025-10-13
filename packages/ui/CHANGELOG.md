# @pr-pilot/ui

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
