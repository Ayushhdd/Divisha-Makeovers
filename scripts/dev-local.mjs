import { spawn } from "node:child_process";
import net from "node:net";
import process from "node:process";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const children = [];
let shuttingDown = false;

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    const done = (open) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(open);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

function run(label, command, args) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    shell: isWindows,
  });

  children.push(child);
  child.once("exit", (code, signal) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[dev] ${label} stopped unexpectedly (${signal || code}).`);
      stopAll(code || 1);
    }
  });
}

function stopAll(exitCode = 0) {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  process.exit(exitCode);
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));

const backendRunning = await isPortOpen(5000);
const siteRunning = await isPortOpen(3000);

if (backendRunning) {
  console.log("[dev] Backend already running at http://localhost:5000/api");
} else {
  console.log("[dev] Starting backend at http://localhost:5000/api");
  run("backend", npmCmd, ["--prefix", "backend", "run", "dev"]);
}

if (siteRunning) {
  console.log("[dev] Website already running at http://localhost:3000");
} else {
  console.log("[dev] Starting website at http://localhost:3000");
  run("website", npmCmd, ["run", "dev:site"]);
}

console.log("[dev] Open http://localhost:3000");
console.log("[dev] Dashboard: http://localhost:3000/portal/divisha/dashboard");

if (children.length === 0) {
  console.log("[dev] Both servers are already running.");
  process.exit(0);
}
