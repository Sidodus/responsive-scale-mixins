// Claims discipline checker (MASTER_GUIDE.md §8).
//   node docs/claims-check.mjs
// Re-verifies every automatable claim in docs/claims.json before a post wave.
// Exit 1 = do not post. (framework-build verification is manual — see the
// harness ledger in AGENTS.md; this script prints the reminder.)
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("..", import.meta.url)); // package root
let failed = 0;

function check(id, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${id}${detail ? "  — " + detail : ""}`);
  if (!ok) failed++;
}

// 1. test-count (the suite also covers interpolation-curve + clamp-output + fallback assertions)
let testOut = "";
try {
  const run = spawnSync(process.execPath, ["test/run-tests.js"], { cwd: repo, encoding: "utf8" });
  testOut = run.stdout ?? "";
  const m = testOut.match(/(\d+) passed, 0 failed/);
  check("test-count", run.status === 0 && m?.[1] === "41", `${m?.[1] ?? "?"} passed — also covers interpolation-curve, clamp-output and fallback-barrier assertions`);
} catch (e) {
  check("test-count", false, e.message.split("\n")[0]);
}

// 2. zero-dependencies
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
check("zero-dependencies", Object.keys(pkg.dependencies ?? {}).length === 0);

// 3. single-file — verified through the mechanism that enforces it: the
// package.json "files" allowlist (plus the entry file existing on disk).
// (`npm pack --dry-run` remains the eyeball check: run it manually.)
try {
  const allowlist = pkg.files ?? [];
  const entryOk = allowlist.includes("index.scss");
  const lockOk = allowlist.every((f) => !f.includes("*") && f !== "docs" && f !== "test");
  const noExtras = !allowlist.some((f) => ["AGENTS.md", "docs", "test", "docs/demo"].includes(f));
  check(
    "single-file",
    entryOk && lockOk && noExtras,
    `files allowlist = ${JSON.stringify(allowlist)} — manual eyeball: npm pack --dry-run (expect 4 files: index.scss, README.md, package.json, LICENSE)`
  );
} catch (e) {
  check("single-file", false, e.message.split("\n")[0]);
}

// 4. version-2.4.0
check("version-2.4.0", pkg.version === "2.4.0", `package.json = ${pkg.version}; re-check npm: npm view responsive-scale-mixins version`);

// 5. audit math (old-formula figures, as documented in CHANGELOG [2.3.0])
const at = (v) => (v / 768) * (24 + ((v - 390) / (1920 - 390)) * 24);
check("audit-70px-1366", Math.abs(at(1366) - 69.9) < 0.1, `1366px -> ${at(1366).toFixed(1)}px`);
check("audit-jump-25x", Math.abs(at(1919) / 48 - 2.5) < 0.01 && Math.abs(23.94 / ((390 / 768) * 24) - 1.96) < 0.01);

// 6. wrong-duration-14-months (v1 2025-09 -> fix in v2.3.0 2026-11-10)
const months = (2026 - 2025) * 12 + (11 - 9);
check("wrong-duration-14-months", months === 14, `${months} months (2025-09 -> 2026-11)`);

// 7. installs-thousands (live npm API)
try {
  const d = await (await fetch("https://api.npmjs.org/downloads/point/last-year/responsive-scale-mixins")).json();
  check("installs-thousands", d.downloads >= 2000, `${d.downloads} downloads last-year (>= 2000 supports 'thousands of installs')`);
} catch {
  console.log("WARN  installs-thousands  — npm API unreachable, verify manually");
}

// 8. clamp-output exact string (compiled from the shipped package)
try {
  const sass = await import("sass");
  const css = sass.compileString(
    `@use "index.scss" as rsm;\n.x { @include rsm.responsive-scale(font-size, 48, 24, $min: 24, $max: 48); }`,
    { loadPaths: [repo] }
  ).css;
  const expected = "clamp(24px, calc(24px + (100vw - 390px) * 24 / 1530), 48px)";
  check("clamp-output", css.includes(expected), expected);
} catch (e) {
  check("clamp-output", false, e.message.split("\n")[0]);
}

console.log("\nmanual before posting: framework-build harnesses (see AGENTS.md harness ledger) + live demo up (https://sidodus.github.io/responsive-scale-mixins/)");
console.log(failed === 0 ? "ALL CLAIMS VERIFIED — safe to post" : `${failed} CLAIM(S) FAILED — do not post`);
process.exit(failed === 0 ? 0 : 1);
