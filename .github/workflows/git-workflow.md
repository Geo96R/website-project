# 🚦 DevOps Git Workflow Guide

## Branch Structure

### 1. **main** (Production Branch)
- **Purpose**: Represents the live, production version of your app
- **Protection**: Protected branch - only merged into by Pull Request (PR)
- **Deployment**: Automatically deployed to production K8s cluster
- **Direct commits**: **NEVER** commit directly to main

### 2. **development** (Integration Branch)
- **Purpose**: Integrates all tested and reviewed features before production
- **Usage**: Internal testing, staging, or preview builds
- **Deployment**: CI/CD can deploy to staging namespace in K8s
- **Direct commits**: **NEVER** commit directly to development

### 3. **feature/*** (Feature Branches)
- **Purpose**: Used for new features, fixes, or experiments
- **Naming Convention**: 
  - `feature/login-ui`
  - `fix/dockerfile-cache`
  - `chore/update-readme`
  - `feat/animated-frames-improvements`
- **Workflow**: Once done → merged into development via Pull Request (PR)

## 🚀 Workflow Process as of current version(i might update later)

### Starting work on a new feature
```bash
# 1. Switch to development and pull latest changes
git checkout development
git pull origin development

# 2. Create feature branch from development
git checkout -b feature/my-feature

# 3. Work on your feature...(Ofcourse)
# Make commits with clear messages
git add .
git commit -m "feat: add new login component"
```

### Completing work
```bash
# 1. Push feature branch
git push -u origin feature/my-feature

# 2. Create Pull Request on GitHub:
#    feature/my-feature → development

# 3. After PR approval and merge:
git checkout development
git pull origin development
git branch -d feature/my-feature
```

### Releasing to production(avoid disaster)
```bash
# 1. Create PR: development → main
# 2. After approval and merge, automated versioning will:
#    - Create git tag (v1.2.3)
#    - Update package.json version
#    - Create GitHub release
#    - Push version changes back to main
```

## 📝 Commit Message Convention

Use conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Example:**
```
feat: improve animated frames with retraction on scroll and recreation at bottom

- Fixed retraction behavior when scrolling down on mobile
- Improved frame recreation positioning at bottom
- Enhanced overall mobile user experience
```

## Branch protection

### For `main` branch:
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict pushes that create files larger than 100MB

### For `development` branch:
- Require pull request reviews before merging
- Require status checks to pass before merging

## 🤖 Automated Versioning

The project uses automated versioning via GitHub Actions:

### How It Works
- **Trigger**: Every push to `main` branch
- **Action**: Automatically creates git tags (v1.2.3)
- **Updates**: package.json and package-lock.json versions
- **Release**: Creates GitHub release with changelog

### Version Bump Types
- **patch** (1.0.0 → 1.0.1): Bug fixes, small improvements
- **minor** (1.0.0 → 1.1.0): New features, non-breaking changes  
- **major** (1.0.0 → 2.0.0): Breaking changes, major rewrites

### Manual Override
To force a specific version bump, include in commit message:
- `[major]` - Force major version bump
- `[minor]` - Force minor version bump  
- `[patch]` - Force patch version bump

## Emergency Hotfixes

For critical production issues:
```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# 2. Make minimal fix and commit
git add .
git commit -m "fix: critical security vulnerability in auth"

# 3. Create PR: hotfix/critical-security-fix → main
# 4. After merge, also merge into development
```

##  Branch Status Dashboard

| Branch | Status | Last Updated | Purpose |
|--------|--------|--------------|---------|
| `main` | 🟢 Production Ready | Latest | Live production |
| `development` | 🟡 Integration | Latest | Staging/testing |
| `feature/*` | 🔵 In Development | Various | Feature work |

## Best Practices

1. **Always start from latest development**: `git checkout development && git pull`
2. **Keep feature branches small**: One feature per branch
3. **Write descriptive commit messages**: Explain what and why
4. **Review before merge**: Use PRs for all merges
5. **Test before merge**: Ensure CI/CD passes
6. **Clean up**: Delete merged feature branches
7. **Regular sync**: Keep development branch updated

## Quick Commands Reference

```bash
# Check current branch
git branch

# Switch to development
git checkout development

# Create feature branch
git checkout -b feature/new-feature

# Push feature branch
git push -u origin feature/new-feature

# Delete local feature branch
git branch -d feature/new-feature

# Delete remote feature branch
git push origin --delete feature/new-feature
```
