# PR Pilot - Implementation Plan

## Phase 1: Foundation (Week 1) ✅ STARTING NOW

### Day 1-2: Core Setup

- [x] Package structure
- [ ] TypeScript config
- [ ] Package.json with dependencies
- [ ] Basic types and interfaces
- [ ] Config schema (Zod)

### Day 3-4: Auto-Detection

- [ ] Package manager detector
- [ ] Commit format detector (check for commitlint)
- [ ] Scope detector (monorepo structure)
- [ ] Base branch detector
- [ ] Hook detector (lint/format commands)

### Day 5-7: Simple Flow (Beginner)

- [ ] Simple prompts (1 question)
- [ ] Git commit action
- [ ] Git push action
- [ ] PR creation (with gh CLI)
- [ ] Fallback (show manual link)

**Goal:** `npx pr-pilot` works end-to-end for beginners

---

## Phase 2: Conventional Flow (Week 2)

### Day 1-3: Conventional Prompts

- [ ] Type selection
- [ ] Scope selection (with auto-suggestions)
- [ ] Subject input
- [ ] Breaking changes prompt
- [ ] Build conventional commit message

### Day 4-5: Pre-commit Hooks

- [ ] Run lint (if detected)
- [ ] Run format (if detected)
- [ ] Handle errors gracefully
- [ ] Re-stage files after format

### Day 6-7: Testing & Polish

- [ ] Test in real repos
- [ ] Error handling
- [ ] Better user messages
- [ ] CLI flags (--conventional, --no-lint, etc.)

**Goal:** `npx pr-pilot --conventional` works perfectly

---

## Phase 3: Config System (Week 3)

### Day 1-2: Config Loading

- [ ] Cosmiconfig setup
- [ ] Load from multiple sources
- [ ] Merge with defaults
- [ ] Validate with Zod

### Day 3-4: Config Features

- [ ] Custom scopes
- [ ] Custom hooks
- [ ] PR settings (draft, labels, reviewers)
- [ ] Cache system (.pr-pilot/cache.json)

### Day 5-7: Advanced Features

- [ ] PR template support
- [ ] Issue linking suggestions
- [ ] Branch name validation
- [ ] Better error messages

**Goal:** Config file works, power users happy

---

## Phase 4: Polish & Release (Week 4)

### Day 1-3: Documentation

- [ ] README with examples
- [ ] Configuration guide
- [ ] Troubleshooting guide
- [ ] Migration guide (from create-pr)

### Day 4-5: Testing

- [ ] Test in multiple repos
- [ ] Test edge cases
- [ ] Test with/without tools
- [ ] Get feedback

### Day 6-7: Release

- [ ] Publish to npm
- [ ] Create GitHub repo
- [ ] Add CI/CD
- [ ] Announce to team

---

## Code Principles

### ✅ DO:

- Write simple, readable code
- Use JSDoc for public APIs
- Handle errors gracefully
- Provide helpful messages
- Test in real scenarios
- Think about the user

### ❌ DON'T:

- Over-engineer
- Add unnecessary abstractions
- Write clever code
- Assume tools exist
- Ignore edge cases
- Forget error messages

---

## Success Metrics

**Beginner Success:**

- Can create PR in < 30 seconds
- No errors on first try
- Understands what happened

**Intermediate Success:**

- Conventional commits work smoothly
- Auto-suggestions save time
- Hooks run without issues

**Advanced Success:**

- Config is intuitive
- Can customize everything
- Doesn't break simple usage

---

## Starting Now: Phase 1, Day 1

Building:

1. Package.json
2. TypeScript config
3. Core types
4. Config schema
5. Package manager detector

Let's ship it! 🚀
