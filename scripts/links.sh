#!/usr/bin/env bash
# Opens every third-party account/app this repo needs — the steps that require
# YOUR GitHub login and credentials. Run this after pushing the repo to GitHub.
set -euo pipefail

REPO="${1:-sebin-gg/sebin-gg-portfolio}"

echo "==========================================================="
echo "  Things only YOU can do (each opens in your browser)"
echo "  Repo assumed at: https://github.com/$REPO"
echo "  (pass your repo slug as an argument to change it)"
echo "==========================================================="
echo

open_url() {
  local url=$1
  echo "Opening: $url"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then
    open "$url"
  else
    echo "  (no xdg-open/open found — visit the URL manually)"
  fi
  sleep 1
}

open_url "https://github.com/new"
echo "  1) Create the repo as: $REPO"
echo "     Suggested name: sebin-gg-portfolio (public so the free tools below work)"
echo
read -r -p "   Press Enter after the repo exists on GitHub…" -n 1 -s && echo

open_url "https://vercel.com/new"
echo "  2) Vercel: Import the repo → framework auto-detected as Next.js → Deploy."
echo "     Environment var (optional): NEXT_PUBLIC_SITE_URL=https://<your-app>.vercel.app"
echo
read -r -p "   Press Enter after deploying to Vercel…" -n 1 -s && echo

open_url "https://github.com/apps/coderabbit"
echo "  3) CodeRabbit (free AI code review) — install on $REPO."
echo "     Config already shipped in .coderabbit.yaml."
echo
read -r -p "   Press Enter after installing CodeRabbit…" -n 1 -s && echo

open_url "https://github.com/apps/dependabot"
echo "  4) Dependabot (dependency updates) — enable in GitHub → Settings → Code security."
echo "     Config already shipped in .github/dependabot.yml (grouped, majors ignored)."
echo
read -r -p "   Press Enter after enabling Dependabot…" -n 1 -s && echo

open_url "https://github.com/apps/sonarcloud"
echo "  5) SonarCloud (free static analysis) — install the GitHub App on $REPO."
echo "     It analyzes every PR as a check (no workflow needed). Match"
echo "     sonar-project.properties:"
echo "       project key  : sebin-gg_portfolio"
echo "       organization : sebin-gg"
echo
read -r -p "   Press Enter after installing the SonarCloud app…" -n 1 -s && echo

open_url "https://github.com/apps/sourcery-ai"
echo "  6) Sourcery (free AI review on public repos) — install on $REPO."
echo "     No config file needed; reviews every PR automatically."
echo
read -r -p "   Press Enter after installing Sourcery…" -n 1 -s && echo

open_url "https://github.com/apps/greptile"
echo "  7) Greptile (free for open source) — install the app, enable $REPO at"
echo "     app.greptile.com, then claim the open-source plan there."
echo "     Config already shipped in greptile.json. MIT LICENSE covers the"
echo "     OSI-license requirement; under 50 stars needs manual approval."
echo
read -r -p "   Press Enter after installing Greptile…" -n 1 -s && echo

open_url "https://app.deepsource.com/login?provider=gh"
echo "  8) DeepSource (free Open Source plan for public repos) — sign in with"
echo "     GitHub, add $REPO. Config already shipped in .deepsource.toml."
echo
read -r -p "   Press Enter after adding DeepSource…" -n 1 -s && echo
echo
echo "Done. When CI runs on your first push it will exercise:"
echo "  • CodeRabbit comments on every PR
  • Sourcery, Greptile and DeepSource reviews once their apps are installed"
echo "  • SonarCloud PR analysis (GitHub App, already installed)"
echo "  • CodeQL + Dependabot for long-term health"
echo "  • Lighthouse budgets + quick subset on PRs, full 288-run matrix nightly"
echo "  • Playwright e2e (chromium/firefox/webkit/mobile) + Vitest coverage on every PR"
