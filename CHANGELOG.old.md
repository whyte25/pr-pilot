# Historical Changelog (semantic-release era)

This changelog was maintained by semantic-release until version 2.0.0.  
For newer releases, see per-package changelogs in `packages/*/CHANGELOG.md`.

---

# [2.0.0](https://github.com/whyte25/pr-pilot/compare/v1.3.0...v2.0.0) (2025-10-13)

### Bug Fixes

* **ci:** correct typecheck script name ([c2ed6a9](https://github.com/whyte25/pr-pilot/commit/c2ed6a971c497e511401b431e90bbc19c83694f6))
* **ci:** update pnpm version to 9.15.4 in workflows ([805c42a](https://github.com/whyte25/pr-pilot/commit/805c42a227512188faa4bba9472a7d4fc7316614))
* **ui:** fix remaining lint errors - replace any with proper types ([24b4a74](https://github.com/whyte25/pr-pilot/commit/24b4a74c0bcba3ce6ab2ee5baf2c9681643b000b))
* **ui:** resolve ESLint parsing errors and fix linting issues ([f965e38](https://github.com/whyte25/pr-pilot/commit/f965e38cc0369a928db6476b8dc5f7a55f9db277))

### Features

* **mcp:** add MCP server for AI assistants ([4f34966](https://github.com/whyte25/pr-pilot/commit/4f34966a687fb2ffa7316be6992585ec1963d997))
* **monorepo:** convert to Turborepo monorepo structure ([4239eb2](https://github.com/whyte25/pr-pilot/commit/4239eb2398ec6307b12269b6afa0a46738a2124f))
* **ui:** add interactive file diff viewer with Git integration ([c5ce996](https://github.com/whyte25/pr-pilot/commit/c5ce996ee9f68adf47fd2deeca97e4a6f73872fa))
* **ui:** add on-demand UI distribution with ultra-lightweight build ([a7869f2](https://github.com/whyte25/pr-pilot/commit/a7869f288ee8cd0b57ea0bfcefadc74a604bf4a0))
* **ui:** add premium UI package with shadcn components ([9035d8a](https://github.com/whyte25/pr-pilot/commit/9035d8a4299f5ebe658f35d0dfa7d3277dc69adb))
* **ui:** fix repo status, add activity links, and paginate commits ([2c2be98](https://github.com/whyte25/pr-pilot/commit/2c2be98218ef9ef481224e8e4f5decdc16061e15))
* **ui:** implement stash and enhance repository status display ([f80b27a](https://github.com/whyte25/pr-pilot/commit/f80b27a10f0d7c3c128d1692fa23149fe9602ba7))
* **ui:** integrate config store with commit form (Phase 1) ([2b87936](https://github.com/whyte25/pr-pilot/commit/2b8793640540071d2869b7b1330332c5ac60bf55))
* **ui:** integrate config with PR form - labels & reviewers (Phase 2) ([2cde502](https://github.com/whyte25/pr-pilot/commit/2cde502446ab86d8b57b0d4ebd966712dfe022f4))
* **ui:** integrate PR form with real GitHub API ([c27b5c2](https://github.com/whyte25/pr-pilot/commit/c27b5c29b41112814c1d591029748cabf1f07372))
* **ui:** integrate rich editor and enhance UI components (Phase 3 & 4) ([9c4523d](https://github.com/whyte25/pr-pilot/commit/9c4523d4c3a4b7cf9d666e9d6c3ad2c996bb1d3e))
* **ui:** optimize PR form and add PR detail view ([fd72862](https://github.com/whyte25/pr-pilot/commit/fd72862ee2197d1a76abdb9d999306f2d3cff82e))

### BREAKING CHANGES

* **monorepo:** Package structure changed to monorepo

## [1.2.1](https://github.com/whyte25/pr-pilot/compare/v1.2.0...v1.2.1) (2025-10-12)

### Bug Fixes

- **actions:** escape dollar signs to prevent shell expansion ([544a7ed](https://github.com/whyte25/pr-pilot/commit/544a7ed9e0e0ae67e939729244afd9944108de61))
- **flows:** fetch remote refs before comparing commits ([e5c26c7](https://github.com/whyte25/pr-pilot/commit/e5c26c787fee5d01eb8cca188116fc7e3f88068a))

# [1.2.0](https://github.com/whyte25/pr-pilot/compare/v1.1.1...v1.2.0) (2025-10-12)

### Bug Fixes

- **actions:** escape backticks in PR title and body ([e969e5f](https://github.com/whyte25/pr-pilot/commit/e969e5fb76633c0927a819cb76d0b5b65e4db76e))
- **flows:** auto-push branch if not tracked in pr-only flow ([ab6a1be](https://github.com/whyte25/pr-pilot/commit/ab6a1be2cb3ad7b5d6f9771baeb4e84230342e5f))

### Features

- **config:** add git.promptForBranch config option ([41d25be](https://github.com/whyte25/pr-pilot/commit/41d25beb69561e25ff4a390c3a3fc42f6d7f1090))

## [1.1.1](https://github.com/whyte25/pr-pilot/compare/v1.1.0...v1.1.1) (2025-10-12)

### Bug Fixes

- **actions:** replace any with unknown in error handling ([16e0c70](https://github.com/whyte25/pr-pilot/commit/16e0c70ae2ed1151b0a6ea63241f41a73ba0d7ea))

# [1.1.0](https://github.com/whyte25/pr-pilot/compare/v1.0.0...v1.1.0) (2025-10-12)

### Bug Fixes

- **actions:** pass base branch to gh pr create command ([975fc79](https://github.com/whyte25/pr-pilot/commit/975fc799a81e3aa886c45dd5bf8fb2f4e40f45d4))
- **cli:** add branch creation prompt and improve error handling ([1363562](https://github.com/whyte25/pr-pilot/commit/1363562898d4d3303208a193615c451223026b4a))
- **cli:** improve GitHub CLI flow and auto-add .pr-pilot to gitignore ([54a6eb8](https://github.com/whyte25/pr-pilot/commit/54a6eb8c5b64e1cbe6405e78aeacdef48ef655ce))

### Features

- **cli:** add checkbox for selecting types of changes in PR body ([b6e9730](https://github.com/whyte25/pr-pilot/commit/b6e9730ef9992c372208d5da1316858f580cee49))
- **cli:** add pr creation prompt for committed changes and implement pr-only flow ([b8ae328](https://github.com/whyte25/pr-pilot/commit/b8ae32821211a4085cfeb48716bc935d4f2c192a))
- **cli:** add pr-only flow and checkbox change types ([117d845](https://github.com/whyte25/pr-pilot/commit/117d8454e07f350019e20c638d21ed9ef3f66e05))

# 1.0.0 (2025-10-12)

### Features

- **cli:** initial commit - PR Pilot v0.1.0 ([7dff1e8](https://github.com/whyte25/pr-pilot/commit/7dff1e84431bc789215960228bfcb9aebf157d6d))
