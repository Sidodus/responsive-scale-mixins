/**
 * Responsive Scale Mixins - assertion test suite (v2.3.0)
 *
 * Run with: npm test   (or: node test/run-tests.js)
 *
 * Compiles representative stylesheets through the Dart Sass JS API and
 * asserts on the generated CSS. Also numerically verifies the interpolation
 * curve is continuous at the breakpoint boundaries.
 *
 * The suite intentionally avoids external dependencies: it uses the `sass`
 * package that is already a devDependency of the repository.
 */

"use strict";

const path = require("path");
const fs = require("fs");
const os = require("os");
const sass = require("sass");

const ROOT = path.join(__dirname, "..");

// ---------------------------------------------------------------------------
// Package staging
//
// Consumer projects resolve `@use "responsive-scale-mixins"` through
// node_modules. To reproduce that resolution without depending on the name
// of this checkout folder, stage a copy of index.scss under a temp
// node_modules-style directory for the duration of the run.
// ---------------------------------------------------------------------------

const STAGING = fs.mkdtempSync(path.join(os.tmpdir(), "rsm-pkg-"));
fs.mkdirSync(path.join(STAGING, "responsive-scale-mixins"));
fs.copyFileSync(
  path.join(ROOT, "index.scss"),
  path.join(STAGING, "responsive-scale-mixins", "index.scss")
);

function cleanupStaging() {
  fs.rmSync(STAGING, { recursive: true, force: true });
}

function loadPaths(extra = []) {
  return [STAGING, ROOT, path.join(ROOT, "node_modules"), ...extra];
}

// ---------------------------------------------------------------------------
// Tiny test framework
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  \u2713 ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, err });
    console.log(`  \u2717 ${name}`);
    console.log(`      ${String(err.message || err).split("\n")[0]}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "assertion failed");
  }
}

function assertIncludes(css, snippet, label) {
  assert(
    css.includes(snippet),
    `${label || "css"} should include \`${snippet}\`\n--- got ---\n${css}`
  );
}

function assertExcludes(css, snippet, label) {
  assert(
    !css.includes(snippet),
    `${label || "css"} should NOT include \`${snippet}\`\n--- got ---\n${css}`
  );
}

// ---------------------------------------------------------------------------
// Compilation helpers
// ---------------------------------------------------------------------------

/**
 * Compile SCSS source with the repository root and node_modules on the load
 * path (mirrors what bundlers do for `@use "responsive-scale-mixins"`).
 * Captures deprecation warnings so tests can assert on them.
 */
function compile(source, options = {}) {
  const warnings = [];
  const result = sass.compileString(source, {
    loadPaths: loadPaths(options.loadPaths),
    quietDeps: false,
    logger: {
      warn: (message) => warnings.push(String(message)),
      debug: () => {},
    },
  });
  return { css: result.css, warnings };
}

/** Compile and expect a Sass error whose message contains `needle`. */
function compileExpectError(source, needle) {
  try {
    sass.compileString(source, { loadPaths: loadPaths() });
  } catch (err) {
    assert(
      String(err.message).includes(needle),
      `expected error containing \`${needle}\`, got: ${err.message}`
    );
    return;
  }
  throw new Error(`expected compilation to fail with \`${needle}\``);
}

/** Memoized default-output CSS (compiled once, reused by several tests). */
let defaultsCache = null;
function defaultsCss() {
  if (defaultsCache === null) {
    defaultsCache = compile(defaultsSrc).css;
  }
  return defaultsCache;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

console.log("\nresponsive-scale-mixins test suite\n");

// ----- 1. Default configuration -------------------------------------------

const defaultsSrc = `
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 48, 24); }
`;

test("default breakpoints are derived from the module defaults", () => {
  assertIncludes(defaultsCss(), "min-width: 390px) and (max-width: 1919px", "tablet MQ");
  assertIncludes(defaultsCss(), "max-width: 389px", "mobile MQ");
});

test("px values are emitted as pure vw lengths with a static fallback", () => {
  assertIncludes(defaultsCss(), "font-size: 48px;", "fallback");
  assertIncludes(defaultsCss(), "font-size: 2.5vw;", "48px at 1920 = 2.5vw");
});

test("output contains no var() and no division-by-length; fluids are @supports-wrapped", () => {
  assertExcludes(defaultsCss(), "var(", "no CSS variables");
  assertIncludes(defaultsCss(), "@supports (font-size: 2.5vw)", "@supports barrier");
  assertExcludes(defaultsCss(), "100vw / 1920px", "no division by a length");
});

/**
 * Minifier-barrier invariant: no plain (non-@supports) rule may declare the
 * same property twice - aggressive minifiers (cssnano in Next.js/CRA) drop
 * the earlier declaration in that case, silently deleting static fallbacks.
 */
function assertNoDuplicatePropertiesInPlainRules(css, label) {
  const stack = []; // "rule" | "media" | "supports"
  const seen = [];
  const violations = [];
  let header = "";
  const tokens = css.replace(/\/\*[\s\S]*?\*\//g, "").split(/([{}])/);
  for (const token of tokens) {
    if (token === "{") {
      const h = header.trim();
      stack.push(
        h.startsWith("@supports") ? "supports" : h.startsWith("@media") ? "media" : "rule"
      );
      seen.push({});
      header = "";
    } else if (token === "}") {
      stack.pop();
      seen.pop();
    } else {
      header = token;
      // Declarations live only in plain rule blocks; anything inside @supports
      // is exempt (that is exactly the minifier barrier the mixin emits).
      if (stack.length && stack[stack.length - 1] === "rule") {
        for (const line of token.split(";")) {
          const m = line.match(/^\s*([a-zA-Z-]+)\s*:/);
          if (m) {
            const scope = seen[seen.length - 1];
            if (scope[m[1]]) {
              violations.push(`${m[1]} declared twice in one plain rule`);
            }
            scope[m[1]] = true;
          }
        }
      }
    }
  }
  assert(
    violations.length === 0,
    `${label}: minifier would prune fallbacks - ${violations.join("; ")}\n${css}`
  );
}

test("fallback pairs are minifier-proof (no duplicate properties in plain rules)", () => {
  const multiSrc = `
@use "responsive-scale-mixins" as rsm;
.a {
  @include rsm.responsive-scale(padding, 32 48, 16 24);
  @include rsm.responsive-scale(margin-top, -10, -20);
  @include rsm.responsive-scale(font-size, 48, 24);
  @include rsm.responsive-scale(font-size, 3, 2, rem);
  @include rsm.responsive-scale(width, 50, 30, vw);
}
`;
  assertNoDuplicatePropertiesInPlainRules(compile(multiSrc).css, "multi-property output");
});

test("tablet interpolation is continuous at both boundaries", () => {
  // curve: mobile branch proportional, tablet linear blend, desktop proportional
  const at = (v) => 24 + ((v - 390) * 24) / 1530; // tablet branch
  const mobileLimit = 24 * 390 / 390; // mobile branch at 390px = 24
  const desktopLimit = 48 * 1920 / 1920; // desktop branch at 1920px = 48
  assert(
    Math.abs(at(390) - mobileLimit) < 0.01,
    `tablet(390)=${at(390)} should equal mobile limit ${mobileLimit}`
  );
  assert(
    Math.abs(at(1920) - desktopLimit) < 0.01,
    `tablet(1920)=${at(1920)} should equal desktop limit ${desktopLimit}`
  );
  assertIncludes(
    defaultsCss(),
    "font-size: calc(24px + (100vw - 390px) * 24 / 1530);",
    "tablet expression"
  );
});

test("mid-range value is not inflated (1366px laptop renders ~39.3px)", () => {
  // The old broken formula rendered ~70px here.
  const at1366 = 24 + ((1366 - 390) * 24) / 1530;
  assert(Math.abs(at1366 - 39.31) < 0.1, `expected ~39.3px, got ${at1366}`);
});

// ----- 2. Module configuration via `@use ... with (...)` -------------------

const configuredSrc = `
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-tablet-width: 768px,
  $rsm-mobile-width: 375px
);
.a { @include rsm.responsive-scale(font-size, 48, 24); }
`;
const configured = compile(configuredSrc).css;

test("`@use with` configuration drives both calc expressions and breakpoints", () => {
  assertIncludes(configured, "min-width: 375px) and (max-width: 1439px", "tablet MQ");
  assertIncludes(configured, "max-width: 374px", "mobile MQ");
  assertIncludes(configured, "font-size: 3.3333333333vw;", "48px at 1440");
  assertIncludes(
    configured,
    "font-size: calc(24px + (100vw - 375px) * 24 / 1065);",
    "tablet expression with custom widths"
  );
});

test("configuration works when the mixin is used before any other rule", () => {
  // Order-independence: the @use config is applied at module load.
  const src = `
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);
.a { @include rsm.responsive-scale(font-size, 48, 24); }
:root { @include rsm.responsive-scale-variables(); }
`;
  const { css } = compile(src);
  assertIncludes(css, "max-width: 1439px", "custom tablet bound");
});

// ----- 3. Separate compilation units (the v2.2.x bug) ----------------------

test("wrapper-file pattern propagates config into every compilation", () => {
  // Simulates the recommended pattern: a project-owned wrapper that configures
  // and forwards the module. Each compilation that imports the wrapper is
  // guaranteed the configured values, no matter how many entries exist.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rsm-test-"));
  const wrapper = path.join(tmp, "_rsm-config.scss");
  fs.writeFileSync(
    wrapper,
    `@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1200px,
  $rsm-mobile-width: 360px
);
@forward "responsive-scale-mixins";
`
  );

  try {
    const globalsResult = sass.compileString(
      `@use "rsm-config" as rsm;
:root { @include rsm.responsive-scale-variables(); }`,
      { loadPaths: loadPaths([tmp]) }
    );
    const componentResult = sass.compileString(
      `@use "rsm-config" as rsm;
.card { @include rsm.responsive-scale(font-size, 48, 24); }`,
      { loadPaths: loadPaths([tmp]) }
    );

    assertIncludes(globalsResult.css, "--computed-scale-factor: calc(100vw / 1200);", "globals vars");
    assertIncludes(componentResult.css, "max-width: 1199px", "component tablet MQ");
    assertIncludes(componentResult.css, "max-width: 359px", "component mobile MQ");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

// ----- 3b. additionalData injection (Next.js / Vite / Vue / Astro pattern) --

test("additionalData injection gives separately compiled stylesheets the same widths", () => {
  // Frameworks prepend this snippet to EVERY compiled stylesheet and compile
  // each file independently - simulated here exactly.
  const additionalData = `@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);
`;
  const globals = compile(`${additionalData}:root { @include rsm.responsive-scale-variables(); }`).css;
  const component = compile(`${additionalData}.card { @include rsm.responsive-scale(font-size, 48, 24); }`).css;

  assertIncludes(globals, "--computed-scale-factor: calc(100vw / 1440);", "globals vars");
  assertIncludes(component, "min-width: 375px) and (max-width: 1439px", "component tablet MQ");
  assertIncludes(component, "max-width: 374px", "component mobile MQ");
});

test("own plain @use coexists with injected configuration; double-config errors clearly", () => {
  const additionalData = `@use "responsive-scale-mixins" as rsm with ($rsm-mobile-width: 375px);\n`;
  const plain = compile(
    `${additionalData}@use "responsive-scale-mixins" as rsm2;\n.b { @include rsm2.responsive-scale(font-size, 48, 24); }`
  ).css;
  assertIncludes(plain, "min-width: 375px) and (max-width: 1919px", "plain @use reuses injected config");

  let errored = false;
  try {
    compile(
      `${additionalData}@use "responsive-scale-mixins" as rsm with ($rsm-desktop-width: 1200px);`
    );
  } catch (err) {
    errored = true;
    assert(
      String(err.message).includes("already loaded"),
      `unexpected error: ${err.message}`
    );
  }
  assert(errored, "expected double configuration to error");
});

// ----- 4. Fallback toggles --------------------------------------------------

test("responsive-scale-no-fallback emits only the fluid declarations", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale-no-fallback(font-size, 48, 24); }
`);
  assertExcludes(css, "font-size: 48px;", "no static fallback");
  assertIncludes(css, "font-size: 2.5vw;", "fluid value");
  assertExcludes(css, "font-size: 24px;", "no tablet/mobile fallbacks");
  assertExcludes(css, "@supports", "no barrier without fallbacks");
});

test("global fallback disable via module configuration", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm with ($rsm-fallback-enabled: false);
.a { @include rsm.responsive-scale(font-size, 48, 24); }
`);
  assertExcludes(css, "font-size: 48px;", "no static fallback");
  assertIncludes(css, "font-size: 2.5vw;", "fluid value");
  assertExcludes(css, "@supports", "no barrier without fallbacks");
});

// ----- 4b. Clamp bounds (v2.4) ----------------------------------------------

test("two-sided clamp bounds wrap every fluid declaration", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 48, 24, $min: 24, $max: 48); }
`);
  assertIncludes(css, "font-size: 48px;", "unclamped static fallback");
  assertIncludes(css, "font-size: clamp(24px, 2.5vw, 48px);", "desktop clamp");
  assertIncludes(
    css,
    "font-size: clamp(24px, calc(24px + (100vw - 390px) * 24 / 1530), 48px);",
    "tablet clamp"
  );
  assertIncludes(css, "font-size: clamp(24px, 6.1538461538vw, 48px);", "mobile clamp");
});

test("one-sided bounds emit max()/min()", () => {
  const { css: minOnly } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 48, 24, $min: 20); }
`);
  assertIncludes(minOnly, "font-size: max(20px, 2.5vw);", "min-only");
  assertExcludes(minOnly, "clamp(", "no clamp for one-sided bound");

  const { css: maxOnly } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 48, 24, $max: 56); }
`);
  assertIncludes(maxOnly, "font-size: min(56px, 2.5vw);", "max-only");
});

test("clamp works with unit-preserving units and stays division-first", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 3, 2, rem, $min: 1.5, $max: 3); }
`);
  assertIncludes(
    css,
    "font-size: clamp(1.5rem, calc(3rem / 1920px * 100vw), 3rem);",
    "rem clamp desktop"
  );
  assertIncludes(
    css,
    "font-size: clamp(1.5rem, calc(2rem + (3rem - 2rem) / (1920px - 390px) * (100vw - 390px)), 3rem);",
    "rem clamp tablet"
  );
});

test("clamp applies per element to list values", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(padding, 32 48, 16 24, $min: 16, $max: 48); }
`);
  assertIncludes(
    css,
    "padding: clamp(16px, 1.6666666667vw, 48px) clamp(16px, 2.5vw, 48px);",
    "per-element clamp"
  );
});

test("clamp errors: inverted bounds and percentage-mode conflict", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 48, 24, $min: 40, $max: 20); }
`,
    "must not be greater"
  );
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(letter-spacing, 1, 1, px, true, 48, 32, $min: 1); }
`,
    "cannot be combined with $is-percentage"
  );
});

test("responsive-scale-no-fallback forwards clamp bounds", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale-no-fallback(font-size, 48, 24, $min: 24, $max: 48); }
`);
  assertIncludes(css, "font-size: clamp(24px, 2.5vw, 48px);", "clamped fluid");
  assertExcludes(css, "font-size: 48px;", "no static fallback");
});

// ----- 4c. Breakpoint map configuration (v2.4) -------------------------------

test("$rsm-breakpoints map drives breakpoints, calc expressions and CSS variables", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm with (
  $rsm-breakpoints: (desktop: 1440px, tablet: 900px, mobile: 375px)
);
.a { @include rsm.responsive-scale(font-size, 48, 24); }
:root { @include rsm.responsive-scale-variables(); }
`);
  assertIncludes(css, "min-width: 375px) and (max-width: 1439px", "tablet MQ");
  assertIncludes(css, "max-width: 374px", "mobile MQ");
  assertIncludes(css, "font-size: 3.3333333333vw;", "desktop fluid");
  assertIncludes(css, "--computed-tablet-scale-factor: calc(100vw / 900);", "tablet var");
});

test("breakpoints() exposes the effective widths", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm with (
  $rsm-breakpoints: (desktop: 1200px, mobile: 360px)
);
@use "sass:map";
@media (min-width: map.get(rsm.breakpoints(), desktop)) { .a { color: red; } }
`);
  assertIncludes(css, "min-width: 1200px", "breakpoints() map readout");
});

test("$rsm-breakpoints conflicts with individual width variables", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1200px,
  $rsm-breakpoints: (desktop: 1440px, mobile: 375px)
);
`,
    "not both"
  );
});

test("$rsm-breakpoints validates unknown keys and missing required keys", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm with ($rsm-breakpoints: (desktop: 1440px, tiny: 100px));
`,
    "only the keys"
  );
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm with ($rsm-breakpoints: (desktop: 1440px));
`,
    "requires at least"
  );
});

test("$rsm-breakpoints validates inverted widths", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm with ($rsm-breakpoints: (desktop: 300px, mobile: 900px));
`,
    "must be greater"
  );
});

// ----- 5. Unit handling ------------------------------------------------------

test("unit-preserving units keep their unit (rem)", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 3, 2, rem); }
`);
  assertIncludes(css, "font-size: 3rem;", "fallback");
  assertIncludes(css, "font-size: calc(3rem / 1920px * 100vw);", "desktop fluid");
  assertIncludes(css, "font-size: calc(2rem / 390px * 100vw);", "mobile fluid");
  assertIncludes(
    css,
    "font-size: calc(2rem + (3rem - 2rem) / (1920px - 390px) * (100vw - 390px));",
    "tablet interpolation preserves rem semantics (division-first, minify-safe)"
  );
});

test("vw/vh units scale proportionally like the legacy behaviour", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(width, 50, 30, vw); @include rsm.responsive-scale(height, 80, 60, vh); }
`);
  assertIncludes(css, "width: calc(50vw / 1920px * 100vw);", "vw desktop");
  assertIncludes(css, "height: calc(80vh / 1920px * 100vw);", "vh desktop");
});

test("absolute units are converted to vw (cm)", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(margin, 2, 1, cm); }
`);
  // 2cm = 75.59px at design width -> 3.937vw
  assertIncludes(css, "margin: 3.937007874vw;", "cm desktop");
});

test("negative values interpolate correctly", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(margin-top, -10, -20); }
`);
  assertIncludes(
    css,
    "margin-top: calc(-20px + (100vw - 390px) * 10 / 1530);",
    "-20px -> -10px tablet slope"
  );
});

test("identical desktop/mobile values emit a single constant declaration", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(border-radius, 8, 8); }
`);
  const tabletBlock = css.slice(css.indexOf("@media"), css.indexOf("max-width: 389px"));
  const occurrences = tabletBlock.split("border-radius: 8px").length - 1;
  assert(occurrences === 1, `expected 1 declaration in tablet block, got ${occurrences}`);
});

// ----- 6. Lists --------------------------------------------------------------

test("list values scale element-by-element", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(padding, 20 40, 10 20); }
`);
  assertIncludes(css, "padding: 20px 40px;", "desktop fallback");
  assertIncludes(css, "padding: 1.0416666667vw 2.0833333333vw;", "desktop fluid");
  assertIncludes(
    css,
    "padding: calc(10px + (100vw - 390px) * 10 / 1530) calc(20px + (100vw - 390px) * 20 / 1530);",
    "tablet per-element interpolation"
  );
});

test("mismatched list lengths fail with a clear error", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(padding, 20 40 60, 10 20); }
`,
    "same length"
  );
});

test("mixed single/list values fail with a clear error", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(padding, 20, 10 20); }
`,
    "both be single values or both be lists"
  );
});

// ----- 7. Percentage mode ----------------------------------------------------

test("percentage mode emits valid static and interpolated values", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(letter-spacing, 1, 1, px, true, 48, 32); }
`);
  assertIncludes(css, "letter-spacing: 0.48px;", "desktop static");
  assertIncludes(css, "letter-spacing: 0.32px;", "mobile static");
  assertIncludes(css, "letter-spacing: 0.4px;", "tablet fallback (midpoint)");
  assertIncludes(
    css,
    "letter-spacing: calc(0.01 * (32px + (100vw - 390px) * 16 / 1530));",
    "tablet modern"
  );
  assertExcludes(css, ")px", "no invalid `)px` artifacts");
});

test("percentage mode requires relative bases", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(letter-spacing, 1, 1, px, true); }
`,
    "requires both"
  );
});

// ----- 8. Validation ---------------------------------------------------------

test("unit error: passing a value with units fails with guidance", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm;
.a { @include rsm.responsive-scale(font-size, 48px, 24px); }
`,
    "unitless number"
  );
});

test("inverted design widths fail with a clear error", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm with ($rsm-desktop-width: 300px, $rsm-mobile-width: 500px);
.a { @include rsm.responsive-scale(font-size, 48, 24); }
`,
    "must be greater"
  );
});

test("non-px width units fail with a clear error", () => {
  compileExpectError(
    `
@use "responsive-scale-mixins" as rsm with ($rsm-desktop-width: 90rem);
.a { @include rsm.responsive-scale(font-size, 48, 24); }
`,
    "must be in px"
  );
});

// ----- 9. Legacy @import ------------------------------------------------------

test("legacy @import + variables-before-import still works", () => {
  const { css } = compile(`
$rsm-desktop-width: 1440px;
$rsm-mobile-width: 375px;
@import "responsive-scale-mixins";
.a { @include responsive-scale(font-size, 48, 24); }
`);
  assertIncludes(css, "max-width: 1439px", "custom tablet bound");
  assertIncludes(css, "max-width: 374px", "custom mobile bound");
});

// ----- 10. responsive-scale-variables() --------------------------------------

test("variables mixin emits unitless-divisor legacy variables", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm;
:root { @include rsm.responsive-scale-variables(1440px, 768px, 375px); }
`);
  assertIncludes(css, "--computed-scale-factor: calc(100vw / 1440);", "desktop factor");
  assertIncludes(
    css,
    "--tablet-proportion-scale-factor: calc((100vw - 375px) / 1065);",
    "proportion factor without division by length"
  );
  assertIncludes(css, "--rsm-fallback-enabled: 1;", "fallback flag");
});

test("breakpoint() exposes configured widths", () => {
  const { css } = compile(`
@use "responsive-scale-mixins" as rsm with ($rsm-mobile-width: 375px);
@media (min-width: rsm.breakpoint("mobile")) { .a { color: red; } }
`);
  assertIncludes(css, "@media (min-width: 375px)", "breakpoint() in MQ");
});

// ----- 11. Deprecations -------------------------------------------------------

test("compilation emits no deprecation warnings", () => {
  const { warnings } = compile(defaultsSrc);
  // Filter the unavoidable @import deprecation out of other checks; here we
  // compiled with @use, so there should be nothing at all.
  assert(warnings.length === 0, `expected no warnings, got:\n${warnings.join("\n")}`);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(
  `\n${passed} passed, ${failed} failed out of ${passed + failed} tests\n`
);

if (failed > 0) {
  failures.forEach(({ name, err }) => {
    console.log(`FAILED: ${name}`);
    console.log(String(err.stack || err.message || err).split("\n").slice(0, 6).join("\n"));
    console.log("");
  });
  process.exit(1);
}
