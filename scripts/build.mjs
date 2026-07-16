import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const nextCli = join(scriptDir, "..", "node_modules", "next", "dist", "bin", "next");

process.env.NODE_OPTIONS = [
  process.env.NODE_OPTIONS,
  "--max-old-space-size=4096",
]
  .filter(Boolean)
  .join(" ");

const result = spawnSync(process.execPath, [nextCli, "build", "--webpack"], {
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
