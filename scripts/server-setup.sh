#!/usr/bin/env bash
# One-time server setup on igat
# Run via: ssh igat 'bash -s' < scripts/server-setup.sh

set -e

APP_DIR=/var/www/scholarship-prototype
REPO_URL=<your-git-remote-url>

echo "==> [1/4] Install bun"
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"

echo "==> [2/4] Install PM2"
bun add -g pm2

echo "==> [3/4] Clone repo"
mkdir -p /var/www
git clone $REPO_URL $APP_DIR
cd $APP_DIR
git checkout main

echo "==> [4/4] Create .env"
cat > $APP_DIR/.env << 'ENVEOF'
DATABASE_URL=postgresql://scholarship_admin:<password>@localhost:5432/scholarship_db
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
BETTER_AUTH_URL=https://scholarship.igat.com.ph
NEXT_PUBLIC_BETTER_AUTH_URL=https://scholarship.igat.com.ph
ENVEOF
echo "    !! Fill in .env values at $APP_DIR/.env before proceeding !!"

echo ""
echo "==> Next steps (app):"
echo "    1. Edit $APP_DIR/.env with real values"
echo "    2. cd $APP_DIR && bun install && bun run build"
echo "    3. pm2 start ecosystem.config.cjs && pm2 save && pm2 startup"
echo ""
echo "==> Next steps (cloudflare tunnel — Docker):"
echo "    1. cloudflared tunnel login"
echo "    2. cloudflared tunnel create scholarship"
echo "         -> copy the tunnel ID into ~/.cloudflared/config.yml"
echo "    3. cloudflared tunnel route dns scholarship scholarship.igat.com.ph"
echo "    4. cp $APP_DIR/.cloudflared/config.yml ~/.cloudflared/config.yml"
echo "         -> fill in your tunnel ID"
echo "    5. docker compose -f $APP_DIR/docker-compose.tunnel.yml up -d"
