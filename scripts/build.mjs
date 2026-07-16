import { spawnSync } from "node:child_process";

process.env.NODE_OPTIONS = [
  process.env.NODE_OPTIONS,
  "--max-old-space-size=4096",
]
  .filter(Boolean)
  .join(" ");

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "build", "--webpack"],
  {
    env: process.env,
    stdio: "inherit",
  },
);

process.exit(result.status ?? 1);
