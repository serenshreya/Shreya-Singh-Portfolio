# PowerShell script to create ~50 incremental commits for the portfolio project
# This simulates a natural development history

$ErrorActionPreference = "Stop"

# Configure git
git init
git config user.email "serenshreyaa@gmail.com"
git config user.name "Shreya Singh"

# Add remote
git remote add origin https://github.com/serenshreya/Shreya-Singh-Portfolio.git 2>$null

# ============================================================
# COMMIT 1: Project initialization with gitignore
# ============================================================
git add .gitignore
git commit -m "chore: initialize project with gitignore"
Write-Host "Commit 1 done" -ForegroundColor Green

# COMMIT 2: Package configuration
git add package.json
git commit -m "chore: add package.json with project dependencies"
Write-Host "Commit 2 done" -ForegroundColor Green

# COMMIT 3: Vite config
git add vite.config.js
git commit -m "build: add Vite configuration"
Write-Host "Commit 3 done" -ForegroundColor Green

# COMMIT 4: ESLint config
git add eslint.config.js
git commit -m "chore: add ESLint configuration"
Write-Host "Commit 4 done" -ForegroundColor Green

# COMMIT 5: Tailwind + PostCSS config
git add tailwind.config.js postcss.config.js
git commit -m "style: add Tailwind CSS and PostCSS configuration"
Write-Host "Commit 5 done" -ForegroundColor Green

# COMMIT 6: HTML entry point
git add index.html
git commit -m "feat: add HTML entry point with meta tags and SEO"
Write-Host "Commit 6 done" -ForegroundColor Green

# COMMIT 7: Environment example
git add .env.example
git commit -m "docs: add .env.example for environment variable reference"
Write-Host "Commit 7 done" -ForegroundColor Green

# COMMIT 8: README
git add README.md
git commit -m "docs: add project README documentation"
Write-Host "Commit 8 done" -ForegroundColor Green

# COMMIT 9: Public favicon
git add public/favicon.svg
git commit -m "asset: add custom favicon SVG"
Write-Host "Commit 9 done" -ForegroundColor Green

# COMMIT 10: Public icon sprite
git add public/icons.svg
git commit -m "asset: add icon sprite SVG for UI elements"
Write-Host "Commit 10 done" -ForegroundColor Green

# COMMIT 11: Profile photo
git add public/shreya.jpg
git commit -m "asset: add profile photo"
Write-Host "Commit 11 done" -ForegroundColor Green

# COMMIT 12: Source assets
git add src/assets/hero.png
git commit -m "asset: add hero background image"
Write-Host "Commit 12 done" -ForegroundColor Green

# COMMIT 13: React + Vite SVGs
git add src/assets/react.svg src/assets/vite.svg
git commit -m "asset: add React and Vite logo SVGs"
Write-Host "Commit 13 done" -ForegroundColor Green

# COMMIT 14: Main entry
git add src/main.jsx
git commit -m "feat: add React entry point with StrictMode"
Write-Host "Commit 14 done" -ForegroundColor Green

# COMMIT 15: Base App CSS
git add src/App.css
git commit -m "style: add base App component styles"
Write-Host "Commit 15 done" -ForegroundColor Green

# COMMIT 16: Supabase client
git add src/lib/supabaseClient.js
git commit -m "feat: add Supabase client initialization module"
Write-Host "Commit 16 done" -ForegroundColor Green

# COMMIT 17: Gemini AI client
git add src/lib/geminiClient.js
git commit -m "feat: add Google Gemini AI client for chatbot"
Write-Host "Commit 17 done" -ForegroundColor Green

# COMMIT 18: PersonalInfo context
git add src/context/PersonalInfoContext.jsx
git commit -m "feat: add PersonalInfo React context with real-time sync"
Write-Host "Commit 18 done" -ForegroundColor Green

# COMMIT 19: Birthday config hook
git add src/hooks/useBirthdayConfig.js
git commit -m "feat: add useBirthdayConfig custom hook"
Write-Host "Commit 19 done" -ForegroundColor Green

# COMMIT 20: GitHub stats hook
git add src/hooks/useGithubStats.js
git commit -m "feat: add useGithubStats hook for GitHub API data"
Write-Host "Commit 20 done" -ForegroundColor Green

# COMMIT 21: Navbar
git add src/components/Navbar.jsx
git commit -m "feat: add responsive Navbar with scroll animations"
Write-Host "Commit 21 done" -ForegroundColor Green

# COMMIT 22: Mobile nav
git add src/components/MobileNav.jsx
git commit -m "feat: add mobile navigation drawer component"
Write-Host "Commit 22 done" -ForegroundColor Green

# COMMIT 23: Hero section
git add src/components/Hero.jsx
git commit -m "feat: add Hero section with typing animation effect"
Write-Host "Commit 23 done" -ForegroundColor Green

# COMMIT 24: Ticker
git add src/components/Ticker.jsx
git commit -m "feat: add scrolling ticker/marquee component"
Write-Host "Commit 24 done" -ForegroundColor Green

# COMMIT 25: About section
git add src/components/About.jsx
git commit -m "feat: add About section with skill bars and stats"
Write-Host "Commit 25 done" -ForegroundColor Green

# COMMIT 26: Skills
git add src/components/Skills.jsx
git commit -m "feat: add Skills section with dynamic icon mapping"
Write-Host "Commit 26 done" -ForegroundColor Green

# COMMIT 27: Projects
git add src/components/Projects.jsx
git commit -m "feat: add Projects section with mobile slider carousel"
Write-Host "Commit 27 done" -ForegroundColor Green

# COMMIT 28: Experience
git add src/components/Experience.jsx
git commit -m "feat: add Experience timeline component"
Write-Host "Commit 28 done" -ForegroundColor Green

# COMMIT 29: Blog
git add src/components/Blog.jsx
git commit -m "feat: add Blog section with Supabase data fetching"
Write-Host "Commit 29 done" -ForegroundColor Green

# COMMIT 30: Contact form
git add src/components/Contact.jsx
git commit -m "feat: add Contact form with database submission"
Write-Host "Commit 30 done" -ForegroundColor Green

# COMMIT 31: Chatbot widget
git add src/components/ChatbotWidget.jsx
git commit -m "feat: add AI chatbot widget powered by Gemini"
Write-Host "Commit 31 done" -ForegroundColor Green

# COMMIT 32: Footer
git add src/components/Footer.jsx
git commit -m "feat: add Footer component with social links"
Write-Host "Commit 32 done" -ForegroundColor Green

# COMMIT 33: Blog post page
git add src/pages/BlogPost.jsx
git commit -m "feat: add individual blog post detail page"
Write-Host "Commit 33 done" -ForegroundColor Green

# COMMIT 34: Birthday page
git add src/pages/BirthdayPage.jsx
git commit -m "feat: add birthday celebration page with confetti"
Write-Host "Commit 34 done" -ForegroundColor Green

# COMMIT 35: App shell with routing
git add src/App.jsx
git commit -m "feat: add App component with React Router setup"
Write-Host "Commit 35 done" -ForegroundColor Green

# COMMIT 36: Admin login
git add src/admin/AdminLogin.jsx
git commit -m "feat: add admin login with password authentication"
Write-Host "Commit 36 done" -ForegroundColor Green

# COMMIT 37: Admin dashboard
git add src/admin/AdminDashboard.jsx
git commit -m "feat: add admin dashboard with sidebar navigation"
Write-Host "Commit 37 done" -ForegroundColor Green

# COMMIT 38: Cloudinary upload
git add src/admin/components/CloudinaryUpload.jsx
git commit -m "feat: add Cloudinary image upload component for admin"
Write-Host "Commit 38 done" -ForegroundColor Green

# COMMIT 39: Admin overview
git add src/admin/sections/AdminOverview.jsx
git commit -m "feat: add admin overview section with dashboard stats"
Write-Host "Commit 39 done" -ForegroundColor Green

# COMMIT 40: Manage Personal Info
git add src/admin/sections/ManagePersonalInfo.jsx
git commit -m "feat: add personal info management with photo upload"
Write-Host "Commit 40 done" -ForegroundColor Green

# COMMIT 41: Manage Skills
git add src/admin/sections/ManageSkills.jsx
git commit -m "feat: add skills CRUD management panel"
Write-Host "Commit 41 done" -ForegroundColor Green

# COMMIT 42: Manage Projects
git add src/admin/sections/ManageProjects.jsx
git commit -m "feat: add projects management with image uploads"
Write-Host "Commit 42 done" -ForegroundColor Green

# COMMIT 43: Manage Experience
git add src/admin/sections/ManageExperience.jsx
git commit -m "feat: add experience and education management panel"
Write-Host "Commit 43 done" -ForegroundColor Green

# COMMIT 44: Manage Blog
git add src/admin/sections/ManageBlog.jsx
git commit -m "feat: add blog post management with rich text editor"
Write-Host "Commit 44 done" -ForegroundColor Green

# COMMIT 45: Manage Contact
git add src/admin/sections/ManageContact.jsx
git commit -m "feat: add contact messages management section"
Write-Host "Commit 45 done" -ForegroundColor Green

# COMMIT 46: Manage Site Config
git add src/admin/sections/ManageSiteConfig.jsx
git commit -m "feat: add site configuration key-value management"
Write-Host "Commit 46 done" -ForegroundColor Green

# COMMIT 47: Manage Birthday
git add src/admin/sections/ManageBirthday.jsx
git commit -m "feat: add birthday celebration config panel"
Write-Host "Commit 47 done" -ForegroundColor Green

# COMMIT 48: Main stylesheet
git add src/index.css
git commit -m "style: add complete design system with dark theme and animations"
Write-Host "Commit 48 done" -ForegroundColor Green

# COMMIT 49: Package lockfile
git add package-lock.json
git commit -m "chore: add package-lock.json dependency lockfile"
Write-Host "Commit 49 done" -ForegroundColor Green

# COMMIT 50: Final - any remaining files (should be none but just in case)
git add -A
$status = git status --porcelain
if ($status) {
    git commit -m "chore: final cleanup and remaining project files"
    Write-Host "Commit 50 done" -ForegroundColor Green
} else {
    Write-Host "No remaining files - all committed!" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All commits created!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Verify no .env leaked
$envCheck = git log --all --diff-filter=A --name-only --pretty="" | Select-String "^\.env$"
if ($envCheck) {
    Write-Host "WARNING: .env was found in git history!" -ForegroundColor Red
} else {
    Write-Host "SAFE: .env is NOT in git history" -ForegroundColor Green
}

# Show commit count and log
$commitCount = git rev-list --count HEAD
Write-Host "`nTotal commits: $commitCount" -ForegroundColor Cyan
git log --oneline
