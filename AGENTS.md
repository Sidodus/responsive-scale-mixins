# AGENTS.md

Guidance for AI coding agents (and human contributors) working on this
repository. Read this before changing anything.

## What this project is

`responsive-scale-mixins` is a **published NPM package** (single-file SCSS
library, `index.scss`) that generates fluid, breakpoint-aware CSS from design
values. Consumers write:

```scss
@use "responsive-scale-mixins" as rsm;
.hero-title { @include rsm.responsive-scale(font-size, 48, 24); }
```

and get static fallback declarations plus fluid `vw`/`calc()` declarations,
with media-query breakpoints derived from three module configuration
variables.

## Repository layout

| Path | Purpose |
| --- | --- |
| `index.scss` | **The entire package.** Everything ships from this one file (deliberate since v2.0.7 - single-file distribution avoids bundler resolution issues). |
| `test/run-tests.js` | Assertion test suite (`npm test`). Uses the `sass` JS API, no other dev dependencies. |
| `test/test.scss`, `test/test.html` | Manual visual test page (compile, then open in a browser). |
| `docs/history/` | Historical design documents from the v2.1/v2.2 "Firefox compatibility" era. **Archived reference only - several claims are outdated.** |
| `.github/workflows/` | CI: compile checks + package validation. |

## Architecture invariants (do not break these)

1. **Single-file distribution.** All public members live in `index.scss`.
   Do not split into partials unless you also solve the bundler resolution
   problems described in the v2.0.7 changelog entry.

2. **No CSS variables in generated scaling output.** The original "blank on
   Firefox Mobile" bug was var()-dependence. The mixins must work without any
   `:root` setup. `responsive-scale-variables()` only emits *legacy* variables
   for consumer convenience.

3. **Fluid declarations are wrapped in `@supports` - it is a minifier
   barrier, not a feature probe.** Verified in a real Next.js 14 production
   build: cssnano (Next.js/CRA) prunes earlier same-property declarations for
   mergeable box properties (padding, margin, width, ...), so a plain
   "fallback + fluid" two-declaration pair silently loses the static
   fallback. Minifiers never merge declarations across an `@supports`
   boundary. When `$enable-fallback` is false, emit the fluid declaration
   plain (no barrier needed).

4. **No division by a length** (e.g. `100vw / 1920px`). Two reasons:
   - unsupported before CSS Values 4 same-type division shipped (2023+
     browsers);
   - **current Dart Sass mangles such calc() expressions into invalid CSS**
     (e.g. `calc(0.15625vw * 1rem / 1px)`).
   Instead: px-style units are emitted as pure vw lengths
   (`calc(48 * 100vw / 1920)` resolves to `2.5vw`), and unit-preserving units
   (rem, em, %, vw, vh, vmin, vmax) use same-type-division forms emitted
   verbatim through `string.unquote(...)` so Sass cannot rewrite them.

4b. **Same-type divisions must be written division-FIRST.** Verified in a
   real Vite build: esbuild's CSS minifier folds concrete sub-expressions and
   can turn `A + (100vw - MWpx) * ((Drem - Mrem) / (DWpx - MWpx))` into
   `A + (100vw - MWpx)*Drem/DWpx` - a length-times-length product that is
   parse-invalid. Division-first (`A + (Drem - Mrem) / (DWpx - MWpx) *
   (100vw - MWpx)`) stays valid after folding.

5. **The interpolation curve must be continuous at both breakpoints.**
   - mobile branch: `mobile-value * viewport / mobile-width`
   - tablet branch: linear blend between mobile-value and desktop-value
   - desktop branch: `desktop-value * viewport / desktop-width`
   The v1-v2.2 tablet formula was discontinuous and inflated; never reintroduce
   a `(100vw / tablet-width)` factor. `test/run-tests.js` asserts continuity.

6. **Widths come from module configuration.** `$rsm-desktop-width`,
   `$rsm-tablet-width`, `$rsm-mobile-width` are `!default` module variables.
   `!global` mutation inside `responsive-scale-variables()` only affects the
   current compilation unit and only for includes that expand *after* it -
   which is why separately-compiled components (Next.js/Angular/Vite) never
   saw widths set from `globals.scss`. `@use ... with (...)` is the reliable
   mechanism; the wrapper-file pattern (configure + `@forward`) is the
   documented fix. `responsive-scale-variables()` parameter defaults must
   reference the module variables (never hardcode numbers) so calling it with
   no arguments does not reset configuration.

7. **Breakpoints are derived from the widths**: mobile = `<= mobile-width - 1`,
   tablet = `[mobile-width, desktop-width - 1]`, desktop = `>= desktop-width`.
   Media queries must use compile-time constants (CSS cannot put `var()` in
   media queries) - this is why configuration is the only propagation channel.

8. **Clamp bounds are emitted verbatim (string.unquote), never as Sass
   calc-family literals.** Sass re-parses literal clamp()/min()/max() and its
   simplifier could mangle same-type-division forms inside. Bounds share the
   $unit, apply to fluid declarations only (static fallbacks keep design
   values), and cannot combine with $is-percentage.
9. **$rsm-breakpoints map is applied at module load, after the helper
    functions are defined** (top-level code runs top-to-bottom). It is
    mutually exclusive with the individual $rsm-*-width variables - mixing
    them must fail with a clear error.
10. **Backwards compatibility of the public API.** `responsive-scale()`,
   `responsive-scale-no-fallback()`, `responsive-scale-variables()`,
   `strip-units()`, `scaled-value()`, `tablet-interpolation()`,
   `mobile-scale-expression()` keep their signatures; the legacy `@import` +
   variables-before-import pattern must keep working.

## How to test

```bash
npm install          # installs devDependencies (sass)
npm test             # assertion suite: 41 tests, must be all green
```

Manual visual check:

```bash
npx --yes sass test/test.scss test/test.css
# open test/test.html in a browser, resize window, inspect computed styles
```

When touching output-affecting code, also compile `test/regression.scss` and
eyeball `regression.css` - tablet expressions should read
`calc(<mobile>px + (100vw - <mw>px) * <delta> / <denominator>)`.

## Framework verification (real builds, not just simulations)

The v2.3.0 changes were validated against real production builds, and TWO
of them found real bugs that Sass-level testing missed:

1. **Vite 5 + React + Vue** (`additionalData` config, CSS Modules, scoped
   styles): esbuild minification reordered a same-type division into invalid
   CSS -> fixed by division-first emission (invariant 4b).
2. **Next.js 14 App Router** (`sassOptions.additionalData`, globals + CSS
   Modules compiled separately): cssnano dropped static fallbacks from plain
   declaration pairs -> fixed by the @supports barrier (invariant 3).
3. **Angular 17** (wrapper file + stylePreprocessorOptions.includePaths,
   component styles inlined into JS): verified clean - fallback pairs,
   @supports barriers and division-first forms all survived its esbuild
   minification. Astro/SvelteKit share Vite's engine and are covered by #1.

If you change emission code, repeat at least the Next.js + Vite builds and
diff the production CSS for: fallback pairs present, `@supports` conditions
valid, no reordered/invalid calc(), custom breakpoints in every chunk.

## Sanity checks before publishing

1. `npm test` green.
2. Compile `test/test.scss` and `test/regression.scss` with zero deprecation
   warnings (`if()` function, division-by-length, etc. are all banned).
3. `npm pack --dry-run` - the tarball must contain **only `index.scss`**
   (enforced by the `files` allowlist in package.json plus `.npmignore`).
4. Update `CHANGELOG.md` and the version in `package.json` and the
   `index.scss` header together.
5. Search the generated CSS for `var(`, `)px`, and `/ 19\d0px`-style
   division-by-length patterns - all must be absent. `@supports` barriers
   around fluid declarations are EXPECTED (see invariant 3).

## House rules

- Keep the changelog in Keep-a-Changelog format; dates use `YYYY-MM-DD`.
- The `fix/` folder was archived to `docs/history/` in v2.3.0; do not revive
  its claims without re-verifying against current code.
- Node toolchain: the dev/CI toolchain requires Node >= 22.12 (sass 1.101.0
  depends on chokidar 5, which is ESM-only). CI pins Node 24 and installs
  from the committed package-lock.json - keep the lockfile committed.
- Windows dev machine: the shell PATH may need
  `export PATH="/usr/bin:$PATH"`-style fixing before git/node resolve in
  bash. Node and sass are installed locally.
- `AGENTS.md`, `test/`, `docs/` and `.npmignore` are intentionally **not**
  published to NPM (the `files` allowlist ships only `index.scss`); keeping
  them in the public GitHub repo is fine and encouraged.
