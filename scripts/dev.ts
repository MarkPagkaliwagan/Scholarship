const bunBin = process.execPath;

function pipeWithPrefix(stream: ReadableStream<Uint8Array> | null, prefix: string, target: NodeJS.WriteStream) {
  if (!stream) return;

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffered = "";

  void (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffered += decoder.decode(value, { stream: true });

      let newlineIndex = buffered.indexOf("\n");
      while (newlineIndex !== -1) {
        const line = buffered.slice(0, newlineIndex);
        target.write(`[${prefix}] ${line}\n`);
        buffered = buffered.slice(newlineIndex + 1);
        newlineIndex = buffered.indexOf("\n");
      }
    }

    buffered += decoder.decode();
    if (buffered.length > 0) {
      target.write(`[${prefix}] ${buffered}\n`);
    }
  })().catch((error) => {
    target.write(`[${prefix}] stream error: ${String(error)}\n`);
  });
}

const dbProcess = Bun.spawn({
  cmd: [bunBin, "scripts/connect.ts"],
  stdout: "pipe",
  stderr: "pipe",
});

pipeWithPrefix(dbProcess.stdout, "db", process.stdout);
pipeWithPrefix(dbProcess.stderr, "db", process.stderr);

dbProcess.exited.then((code) => {
  if (code !== 0) {
    process.stderr.write(`[db] tunnel exited with code ${code}. Web dev server still running.\n`);
  }
});

const webProcess = Bun.spawn({
  cmd: [bunBin, "x", "next", "dev", "-p", "5001"],
  stdout: "pipe",
  stderr: "pipe",
});

pipeWithPrefix(webProcess.stdout, "web", process.stdout);
pipeWithPrefix(webProcess.stderr, "web", process.stderr);

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  process.stderr.write(`\n[dev] received ${signal}, stopping child processes...\n`);

  dbProcess.kill();
  webProcess.kill();

  const [, webCode] = await Promise.all([dbProcess.exited.catch(() => 1), webProcess.exited.catch(() => 1)]);
  process.exit(webCode);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

const webCode = await webProcess.exited;

if (!shuttingDown) {
  dbProcess.kill();
  process.exit(webCode);
}
