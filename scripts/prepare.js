import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

// Git installs run lifecycle scripts in environments where dev tools may be absent.
// Only attempt to install Husky hooks when this is a working tree with Husky available.
if (!existsSync(".git")) {
	process.exit(0);
}

const huskyBin = "node_modules/husky/bin.js";

if (!existsSync(huskyBin)) {
	process.exit(0);
}

execFileSync(process.execPath, [huskyBin], { stdio: "inherit" });
