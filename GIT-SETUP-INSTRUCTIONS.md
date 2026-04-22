# Git Setup Instructions for Digital Marketrix Website

## 📋 Push to GitHub Repository

Follow these steps to push your website to the GitHub repository: https://github.com/jrose4502-ai/digital-marketrix.git

### Step 1: Open Terminal/Command Prompt

Navigate to your website directory:
```bash
cd C:\websitecode\website
```

### Step 2: Initialize Git Repository

```bash
git init
```

### Step 3: Configure Git (if not already done)

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 4: Add All Files

```bash
git add .
```

### Step 5: Create Initial Commit

```bash
git commit -m "Initial commit: Digital Marketrix website with React components"
```

### Step 6: Add Remote Repository

```bash
git remote add origin https://github.com/jrose4502-ai/digital-marketrix.git
```

### Step 7: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If prompted for authentication, you may need to use a Personal Access Token (PAT) instead of your password.

## 🔐 GitHub Authentication

### Creating a Personal Access Token (PAT)

1. Go to GitHub.com and sign in
2. Click your profile picture → Settings
3. Scroll down and click "Developer settings"
4. Click "Personal access tokens" → "Tokens (classic)"
5. Click "Generate new token" → "Generate new token (classic)"
6. Give it a name like "Digital Marketrix Website"
7. Select scopes: Check "repo" (full control of private repositories)
8. Click "Generate token"
9. **COPY THE TOKEN** (you won't see it again!)

### Using the Token

When pushing, use the token as your password:
- Username: `jrose4502-ai`
- Password: `<your-personal-access-token>`

## 📝 Future Updates

After making changes to your website:

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

## 🌿 Branch Management (Optional)

Create a development branch for testing:

```bash
# Create and switch to dev branch
git checkout -b dev

# Make changes, then commit
git add .
git commit -m "Your changes"

# Push dev branch
git push origin dev

# When ready, merge to main
git checkout main
git merge dev
git push origin main
```

## 🚀 Common Git Commands

```bash
# Check status
git status

# View commit history
git log

# View remote URL
git remote -v

# Pull latest changes
git pull origin main

# Discard local changes
git checkout -- <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## ❓ Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/jrose4502-ai/digital-marketrix.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied"
- Make sure you're using the correct Personal Access Token
- Ensure the token has "repo" permissions

## 📚 Additional Resources

- [GitHub Docs - About Remote Repositories](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories)
- [GitHub Docs - Managing Remote Repositories](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)
- [Git Basics Guide](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)

---

Need help? Contact: info@digitalmarketrix.com

