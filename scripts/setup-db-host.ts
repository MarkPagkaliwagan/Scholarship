import { readFileSync } from "fs";
import { writeFileSync } from "fs";
import { $ } from "bun";

const hostname = process.env.TUNNEL_HOSTNAME ?? "trial-db.igat.com.ph";
const hostsPath = process.platform === "win32"
  ? `${process.env.SystemRoot ?? "C:\\Windows"}\\System32\\drivers\\etc\\hosts`
  : "/etc/hosts";

type DnsAnswer = {
  Status?: number;
  Answer?: Array<{ type: number; data: string }>;
};

async function resolveIpv4(host: string) {
  const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`, {
    headers: { accept: "application/dns-json" },
  });

  if (!response.ok) {
    throw new Error(`DNS lookup failed: ${response.status}`);
  }

  const body = await response.json() as DnsAnswer;
  const address = body.Answer?.find((answer) => answer.type === 1)?.data;

  if (!address) {
    throw new Error(`No IPv4 record found for ${host}`);
  }

  return address;
}

function hostsContains(host: string) {
  try {
    const hosts = readFileSync(hostsPath, "utf8");
    return hosts.split(/\r?\n/).some((line) => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith("#") && trimmed.split(/\s+/).slice(1).includes(host);
    });
  } catch {
    return false;
  }
}

if (hostsContains(hostname)) {
  console.log(`${hostname} already pinned in ${hostsPath}.`);
  process.exit(0);
}

const address = await resolveIpv4(hostname);
const line = `${address} ${hostname}`;

if (process.platform === "darwin") {
  const command = `printf '\\n${line}\\n' >> ${hostsPath}`;
  console.log(`Adding ${line} to ${hostsPath}. macOS may ask for admin approval.`);
  await $`osascript -e ${`do shell script "${command.replaceAll("\"", "\\\"")}" with administrator privileges`}`;
} else if (process.platform === "win32") {
  const escapedLine = line.replaceAll("'", "''");
  const tempDir = process.env.TEMP ?? process.env.TMP ?? "C:\\Windows\\Temp";
  const tempScript = `${tempDir}\\igat-setup-db-host.ps1`;
  const tempLog = `${tempDir}\\igat-setup-db-host.log`;
  const script = [
    `$ErrorActionPreference = 'Stop'`,
    `Start-Transcript -Path '${tempLog}' -Force | Out-Null`,
    `$hosts = "$env:SystemRoot\\System32\\drivers\\etc\\hosts"`,
    `if (-not (Select-String -Path $hosts -Pattern '${hostname}' -Quiet)) {`,
    `  Add-Content -Path $hosts -Value "\`r\`n${escapedLine}"`,
    `}`,
    `Write-Host '${hostname} pinned to ${address}.'`,
    `Stop-Transcript | Out-Null`,
  ].join("; ");
  writeFileSync(tempScript, script, "utf8");
  const command = `Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','${tempScript}'`;

  console.log(`Adding ${line} to ${hostsPath}. Windows may ask for administrator approval.`);
  await $`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ${command}`;
  try {
    const log = readFileSync(tempLog, "utf8").trim();
    if (log) console.log(log);
  } catch {
    console.log(`${hostname} pinned to ${address}.`);
  }
} else {
  console.log(`Skipping hosts setup on ${process.platform}. Add this line manually if IPv6 breaks cloudflared:`);
  console.log(line);
  process.exit(0);
}

console.log(`${hostname} pinned to ${address}.`);
