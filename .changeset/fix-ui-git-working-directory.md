---
"@pr-pilot/ui": patch
---

Fix UI git operations when running via npx

- Fixed "Not a git repository" error when running UI via npx
- UI now correctly uses the user's working directory instead of the package installation directory
- Added PR_PILOT_CWD environment variable to pass user's directory to the server
- Updated git service to use the correct working directory for all git operations
