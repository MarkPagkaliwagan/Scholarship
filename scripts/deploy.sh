#!/usr/bin/env bash
# Deploy scholarship portal to igat server
# Usage: bash scripts/deploy.sh [branch]

set -e

BRANCH=${1:-main}
REMOTE=igat
APP_DIR=/var/www/scholarship-prototype

echo "==> Deploying branch '$BRANCH' to $REMOTE:$APP_DIR"

ssh $REMOTE bash -s << EOF
  set -e
  cd $APP_DIR

  echo "--- pulling latest ---"
  git fetch origin
  git checkout $BRANCH
  git pull origin $BRANCH

  echo "--- installing deps ---"
  bun install --frozen-lockfile

  echo "--- building ---"
  bun run build

  echo "--- restarting pm2 ---"
  pm2 restart scholarship-portal 2>/dev/null || pm2 start ecosystem.config.cjs
  pm2 save

  echo "--- done ---"
  pm2 status scholarship-portal
EOF
