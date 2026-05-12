// iGAT DB - Tunnel Connect
// Usage: bun scripts/connect.ts
// First run downloads cloudflared automatically. No admin needed.

import { existsSync } from "fs";
import { join } from "path";
import { $ } from "bun";

const TUNNEL_HOSTNAME = "trial-db.igat.com.ph";
const LOCAL_PORT      = "5433";
const DB_URL          = `postgresql://lgu_admin:eU5YDygexu6cmMz8pznzen8QIHzDA7d4@localhost:${LOCAL_PORT}/lgu_system`;

const ARCH = process.arch === "arm64" ? "arm64" : "amd64";
const PLATFORM_URLS: Record<string, string> = {
  win32:  `https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe`,
  darwin: `https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-${ARCH}`,
  linux:  `https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}`,
};

const EXE_NAME  = process.platform === "win32" ? "cloudflared.exe" : "cloudflared";
const LOCAL_EXE = join(import.meta.dir, EXE_NAME);

const systemCheck = await $`which cloudflared`.quiet().nothrow();
const EXE_PATH = systemCheck.exitCode === 0
  ? systemCheck.stdout.toString().trim()
  : LOCAL_EXE;

if (EXE_PATH === LOCAL_EXE && !existsSync(LOCAL_EXE)) {
  const url = PLATFORM_URLS[process.platform];
  if (!url) { console.error(`Unsupported platform: ${process.platform}`); process.exit(1); }
  console.log("Downloading cloudflared (first run only)...");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  await Bun.write(LOCAL_EXE, res);
  await $`chmod +x ${LOCAL_EXE}`.quiet();
  console.log("Done.\n");
}

console.log(`\n  iGAT DB - Tunnel Connect`);
console.log(`  =========================`);
console.log(`\n  Tunnel: localhost:${LOCAL_PORT} -> ${TUNNEL_HOSTNAME}`);
console.log(`\n  DATABASE_URL:`);
console.log(`  ${DB_URL}`);
console.log(`\n  Keep this terminal open. Ctrl+C to stop.\n`);

await $`${EXE_PATH} access tcp --hostname ${TUNNEL_HOSTNAME} --url localhost:${LOCAL_PORT}`;
