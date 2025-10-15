# Automated Release Workflow

## 🎉 Fully Automated - Like Semantic Release!

Your release workflow is now **100% automated**. No more manual PR merging!

## How It Works

### 1. Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/my-feature

# 2. Make your changes
# ... code changes ...

# 3. Create a changeset
pnpm changeset
# Choose package(s), version bump type, and describe changes

# 4. Commit and push
git add .
git commit -m "feat(package): add new feature"
git push

# 5. Create PR to dev
gh pr create --base dev --title "feat: add new feature"

# 6. Merge to dev when approved
```

### 2. Release to Production (Automated!)

```bash
# 1. Merge dev to main
gh pr create --base main --head dev --title "chore(release): merge dev to main"

# 2. Merge the PR
# ✨ Everything else is AUTOMATIC!
```

## What Happens Automatically

When you merge to `main`:

1. ✅ **Release workflow triggers**
2. ✅ **Changesets analyzes** all changesets in `.changeset/`
3. ✅ **Version PR is created** with updated versions and changelogs
4. ✅ **Auto-merge is enabled** on the version PR
5. ✅ **Checks run** (Build, Lint, Type Check)
6. ✅ **PR auto-merges** when checks pass
7. ✅ **Packages are published** to npm
8. ✅ **Git tags are created** for each package version

## Zero Manual Steps! 🚀

You literally just:

1. Merge dev → main
2. Wait ~2-3 minutes
3. Packages are live on npm!

## Comparison with Semantic Release

| Feature                | Semantic Release | Changesets (Our Setup) |
| ---------------------- | ---------------- | ---------------------- |
| Auto version bump      | ✅               | ✅                     |
| Auto changelog         | ✅               | ✅                     |
| Auto publish           | ✅               | ✅                     |
| Auto PR merge          | ✅               | ✅ (now!)              |
| Monorepo support       | ⚠️ Complex       | ✅ Native              |
| Manual version control | ❌               | ✅ (via changesets)    |
| Review before publish  | ❌               | ✅ (version PR)        |

## Example Changeset

Create `.changeset/my-feature.md`:

```markdown
---
'@pr-pilot/core': minor
'@pr-pilot/ui': patch
---

Add new feature to core and fix UI bug

- Added feature X to core package
- Fixed bug Y in UI package
```

## Monitoring Releases

Check release status:

```bash
# View latest release workflow
gh run list --workflow=release.yml --limit 1

# View workflow logs
gh run view --log

# Check published versions
npm view @pr-pilot/core version
npm view @pr-pilot/ui version
npm view @pr-pilot/mcp version
```

## Troubleshooting

### Version PR doesn't auto-merge?

Check that auto-merge is enabled in repo settings:

- Settings → General → Pull Requests
- ✅ "Allow auto-merge"

### Packages not publishing?

Check NPM_TOKEN secret:

- Settings → Secrets and variables → Actions
- Add `NPM_TOKEN` with your npm token

### Want to skip a release?

Just don't merge to main! Keep working on dev until ready.

---

**No more stress, no more manual steps!** 🎊
