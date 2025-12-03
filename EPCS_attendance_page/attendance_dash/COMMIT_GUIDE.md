# Guide: Committing Changes to GitHub

## Step 1: Check Git Repository Status

Navigate to your project directory and check if it's a git repository:

```powershell
cd "c:\Users\donju\OneDrive\Desktop\us001-feature-dash\EPCS_attendance_page\EPCS_attendance_page\attendance_dash"
git status
```

**If you see an error** saying "not a git repository", initialize one:

```powershell
git init
```

## Step 2: Check What Files Have Changed

View all modified and new files:

```powershell
git status
```

## Step 3: Add Files to Staging

### Option A: Add all changes
```powershell
git add .
```

### Option B: Add specific files (recommended)
```powershell
git add nuxt.config.ts
git add tsconfig.json
# Add any other files you've changed
```

## Step 4: Commit Your Changes

Create a commit with a descriptive message:

```powershell
git commit -m "Fix TypeScript error in nuxt.config.ts - add explicit defineNuxtConfig import"
```

Or for a more detailed message:

```powershell
git commit -m "Fix TypeScript error in nuxt.config.ts

- Added explicit import for defineNuxtConfig from 'nuxt/config'
- Created tsconfig.json to extend Nuxt's generated types
- Ran nuxt prepare to generate TypeScript types"
```

## Step 5: Connect to GitHub (First Time Only)

If you haven't connected this repository to GitHub yet:

### A. Create a new repository on GitHub
1. Go to https://github.com/new
2. Create a new repository (don't initialize with README if you already have code)
3. Copy the repository URL (e.g., `https://github.com/yourusername/attendance-dash.git`)

### B. Add the remote and push
```powershell
git remote add origin https://github.com/yourusername/attendance-dash.git
git branch -M main
git push -u origin main
```

## Step 6: Push Changes (If Already Connected)

If your repository is already connected to GitHub:

```powershell
git push
```

Or if you're on a different branch:

```powershell
git push origin main
# or
git push origin your-branch-name
```

## Quick Summary Commands

For an existing repository:

```powershell
cd "c:\Users\donju\OneDrive\Desktop\us001-feature-dash\EPCS_attendance_page\EPCS_attendance_page\attendance_dash"
git add .
git commit -m "Fix TypeScript error in nuxt.config.ts"
git push
```

## Troubleshooting

### If you get authentication errors:
- GitHub requires authentication. You can use:
  - Personal Access Token (recommended)
  - GitHub CLI (`gh auth login`)
  - SSH keys

### If you need to see your remote repository:
```powershell
git remote -v
```

### If you need to change the remote URL:
```powershell
git remote set-url origin https://github.com/yourusername/your-repo.git
```

