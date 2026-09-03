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
  echo "Opening: $1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$1" >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then
    open "$1"
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

open_url "https://github.com/apps/renovate"
echo "  4) Renovate (dependency updates) — install on $REPO."
echo "     Config already shipped in renovate.json."
echo "     Prefer Dependabot instead? Then skip this and enable Dependabot"
echo "     in GitHub → Settings → Code security → Dependabot (config shipped)."
echo
read -r -p "   Press Enter after installing Renovate (or skip)…" -n 1 -s && echo

open_url "https://sonarcloud.io/projects/create"
echo "  5) SonarCloud (free static analysis): create project for $REPO."
echo "     IMPORTANT — match sonar-project.properties:"
echo "       project key  : sebin-gg_portfolio"
echo "       organization : sebin-gg"
echo "     Then add the SONAR_TOKEN to:"
echo "     https://github.com/$REPO/settings/secrets/actions"
echo
read -r -p "   Press Enter after SonarCloud + secret are set…" -n 1 -s && echo

echo
echo "Done. When CI runs on your first push it will exercise:"
echo "  • CodeRabbit comments on every PR"
echo "  • SonarCloud gate (needs SONAR_TOKEN above)"
echo "  • CodeQL + Dependabot/Renovate for long-term health"
echo "  • Lighthouse budgets + Stryker mutation score on main"
echo "  • Playwright e2e + Vitest coverage on every PR"
