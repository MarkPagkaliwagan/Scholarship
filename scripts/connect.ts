// iGAT DB - Tunnel Connect
// Usage: bun scripts/connect.ts
// First run downloads cloudflared automatically. No admin needed.

import { existsSync } from "fs";
import { join } from "path";
import { lookup } from "dns/promises";
import { $ } from "bun";

const TUNNEL_MODE = process.env.DB_TUNNEL_MODE ?? "cloudflare";
const TUNNEL_HOSTNAME = process.env.TUNNEL_HOSTNAME ?? "trial-db.igat.com.ph";
const SSH_TARGET = process.env.DB_SSH_TARGET ?? "igat-spc";
const REMOTE_DB_HOST = process.env.REMOTE_DB_HOST ?? "trial-postgres";
const REMOTE_DB_PORT = process.env.REMOTE_DB_PORT ?? "5432";
const LOCAL_PORT = process.env.LOCAL_PORT ?? "5433";
const EDGE_IP_VERSION = process.env.TUNNEL_EDGE_IP_VERSION ?? "4";
const SHOULD_SETUP_HOST = process.env.DB_SETUP_HOST !== "0";
const DB_URL = process.env.DATABASE_URL
  ?? `postgresql://lgu_admin:eU5YDygexu6cmMz8pznzen8QIHzDA7d4@localhost:${LOCAL_PORT}/lgu_system`;
const SSH_LOCAL_FORWARD = `127.0.0.1:${LOCAL_PORT}:${REMOTE_DB_HOST}:${REMOTE_DB_PORT}`;

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
if (TUNNEL_MODE === "ssh") {
  console.log(`\n  Tunnel: localhost:${LOCAL_PORT} -> ${REMOTE_DB_HOST}:${REMOTE_DB_PORT} via ssh ${SSH_TARGET}`);
} else {
  console.log(`\n  Tunnel: localhost:${LOCAL_PORT} -> ${TUNNEL_HOSTNAME}`);
}
console.log(`\n  DATABASE_URL:`);
console.log(`  ${DB_URL}`);
console.log(`\n  Keep this terminal open. Ctrl+C to stop.\n`);

if (TUNNEL_MODE === "ssh") {
  await $`ssh -N -L ${SSH_LOCAL_FORWARD} ${SSH_TARGET}`;
  process.exit(0);
}

if (SHOULD_SETUP_HOST) {
  const setup = await $`${process.execPath} scripts/setup-db-host.ts`.nothrow();
  if (setup.exitCode !== 0) {
    process.stderr.write(setup.stderr.toString());
    console.warn("DB host setup failed. Continuing anyway.");
  } else {
    process.stdout.write(setup.stdout.toString());
  }
}

try {
  await lookup(TUNNEL_HOSTNAME);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`Cloudflare DB hostname not resolvable via local system resolver: ${TUNNEL_HOSTNAME}`);
  console.warn(message);
  console.warn("Continuing anyway. cloudflared may still resolve it.");
}

const tunnel = await $`${EXE_PATH} --edge-ip-version ${EDGE_IP_VERSION} access tcp --hostname ${TUNNEL_HOSTNAME} --url localhost:${LOCAL_PORT}`.nothrow();
if (tunnel.exitCode === 0) {
  process.exit(0);
}

const stderr = tunnel.stderr.toString();
if (stderr.includes(`lookup ${TUNNEL_HOSTNAME}`) || stderr.includes("Could not resolve host")) {
  console.error(`Cloudflare DNS lookup failed for ${TUNNEL_HOSTNAME}.`);
  console.error(`Set TUNNEL_HOSTNAME=<real-db-hostname> and retry.`);
  console.error(`Local fallback: DB_TUNNEL_MODE=ssh bun scripts/connect.ts`);
} else {
  process.stderr.write(stderr);
}
process.exit(tunnel.exitCode);
