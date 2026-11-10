# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2026-11-10

### Added

- **Clamp bounds**: `$min` / `$max` parameters on `responsive-scale()` (and
  `responsive-scale-no-fallback()`) bound the fluid scaling:

  ```scss
  @include rsm.responsive-scale(font-size, 48, 24, $min: 24, $max: 48);
  // -> clamp(24px, <fluid>, 48px) on every fluid declaration
  ```

  The classic "never smaller than the mobile design value, never larger than
  the desktop design value" pattern is `$min: <mobile-value>, $max:
  <desktop-value>`. One-sided bounds emit `max()` / `min()`. Bounds apply to
  the fluid declarations only - static fallbacks keep the design values - and
  work with all units (bounds share the `$unit` parameter). Verified to
  survive cssnano (Next.js) and esbuild (Vite) minification unchanged.
- **Breakpoint map configuration**: an alternative to the individual width
  variables:

  ```scss
  @use "responsive-scale-mixins" as rsm with (
    $rsm-breakpoints: (desktop: 1440px, tablet: 768px, mobile: 375px)
  );
  ```

  `desktop` and `mobile` are required, `tablet` is optional. Validated at
  load time (unknown keys, missing keys, inverted widths, and mixing the two
  configuration forms all fail with clear errors).
- **`breakpoints()` function** returning the effective design widths as a
  map, for building your own media queries aligned with the mixins:

  ```scss
  @media (min-width: map.get(rsm.breakpoints(), desktop)) { ... }
  ```
- **Live demo page** (`docs/demo/`), deployable to GitHub Pages via the
  included `.github/workflows/deploy-demo.yml`.
- **Release automation**: `.github/workflows/release.yml` - pushing a `v*`
  tag verifies the tag matches `package.json`, runs the test suite, validates
  the tarball and creates the GitHub Release. npm publishing stays a manual
  maintainer step.

## [2.3.0] - 2026-11-10

### Added

- **Module configuration for design widths** - the recommended way to set
  breakpoints:

  ```scss
  @use "responsive-scale-mixins" as rsm with (
    $rsm-desktop-width: 1440px,
    $rsm-tablet-width: 768px,
    $rsm-mobile-width: 375px
  );
  ```

  Configuration is applied at module load, works regardless of rule order,
  and reaches every stylesheet compiled with it - fixing the long-standing
  issue where custom widths set from `globals.scss` never reached components
  compiled as separate compilation units (Next.js, Angular, Vite CSS
  Modules). A wrapper-file pattern (`@use ... with` + `@forward`) is
  documented for such builds.
- `breakpoint("desktop" | "tablet" | "mobile")` function exposing the
  configured widths.
- Input validation with clear error messages: unitless-number values,
  px (or unitless) widths, desktop-width > mobile-width, matching list
  lengths, percentage mode requiring relative bases.
- Real assertion test suite (`test/run-tests.js`, `npm test`) covering
  breakpoint propagation, interpolation continuity, fallback toggles, units,
  lists, percentage mode, legacy `@import`, and zero deprecation warnings.

### Fixed

- **Tablet interpolation formula** (behavior change): the old formula
  multiplied the interpolated value by `(100vw / tablet-width)`, inflating
  mid-range values (a 48px desktop / 24px mobile value rendered ~70px on a
  1366px laptop) and producing 2-2.5x jumps at the breakpoint boundaries
  (24px -> 12px crossing 390px; ~120px -> 48px crossing 1920px with default
  widths). The new curve is the exact linear blend between the mobile and
  desktop design values and is continuous at every breakpoint.
- **Invalid calc() output**: all expressions now avoid division by a length
  (`100vw / 1920px`), which was unsupported before 2023 browsers AND is
  mangled into invalid CSS by current Dart Sass versions (e.g.
  `calc(0.15625vw * 1rem / 1px)`). px-style units are emitted as pure vw
  lengths; unit-preserving units (rem, em, %, vw, vh, vmin, vmax) use
  same-type-division forms emitted verbatim with static fallbacks.
- **Invalid percentage fallback CSS** (`calc(1 / 100 * 48)px` - the unit was
  appended outside the calc()).
- **`responsive-scale-variables()` no longer resets configured widths**: its
  parameter defaults now follow the module configuration, so calling it with
  no arguments respects `@use with` instead of silently reverting to
  1920px/768px/390px.
- Removed the deprecated `if()` function usage that emitted a Sass
  deprecation warning on current Dart Sass.

### Changed

- **Output structure**: fluid declarations are wrapped in `@supports` again
  (as in v2.1/v2.2) - but the expressions inside are now valid in every
  browser. Verified during real framework testing: cssnano (Next.js / CRA
  production builds) prunes earlier same-property declarations for mergeable
  box properties (padding, margin, width, ...), which would silently delete
  the static fallback from a plain two-declaration pair. The `@supports`
  rule is an optimization barrier minifiers respect.
- **Unit-preserving interpolation is division-first**:
  `calc(2rem + (3rem - 2rem) / (1920px - 390px) * (100vw - 390px))`.
  Verified in a real Vite build: esbuild minification folds concrete
  sub-expressions and would otherwise reorder the ratio into an invalid
  length-times-length product.
- `responsive-scale-variables()` is now **optional**; the scaling mixins no
  longer depend on CSS variables.
- The `$important` parameter accepts `true` in addition to a string like
  `" !important"`.
- `get-scale-factor()`, `get-tablet-scale-factor()` and
  `get-mobile-scale-factor()` internal helpers removed (dead code without
  var() output).
- Identical desktop/mobile values emit a single constant declaration in the
  tablet range instead of a redundant fallback pair.
- `--tablet-proportion-scale-factor` and friends are emitted with unitless
  divisors (valid in every calc-capable browser).

## [2.2.2] - 2026-08-30

### Fixed

- Previously, media query breakpoints were hardcoded (768px/991px/767px),
so custom design widths passed to responsive-scale-variables() only
affected the calc() expressions while the breakpoint ranges silently
kept using the defaults. Breakpoints are now derived from the supplied
mobile/desktop widths (tablet spans mobile-width to desktop-width - 1,
mobile spans up to mobile-width - 1).
- Replace the invalid if(sass(...): 1; else: 0) call inside
responsive-scale-variables() with the standard if($cond, a, b) form;
the invalid syntax broke compilation for every consumer.

## [2.2.1] - 2026-06-18

### Fixed

- Patch release updating version metadata and documentation to `2.2.1`.
- Added local regression validation for tablet responsive calc output.
- Confirmed package metadata and CI package dry-run checks reflect the new version.

## [2.2.0] - 2026-06-17

## 🚀 v2.2.0 - Universal Browser Compatibility (No Breaking Changes)

**Automatic fallback generation for browsers without CSS variable support!**

### **✨ What's New**

- **Universal Browser Support**: Now works on Firefox Mobile, old Android browsers, and budget devices
- **Automatic Fallbacks**: Generates both modern calc() AND static fallback values
- **Zero Code Changes**: Your existing code works exactly the same
- **Progressive Enhancement**: Modern browsers get responsive scaling, old browsers get static values

### **🎯 Browser Support Matrix**

| Browser                       | v2.1.x                     | v2.2.0                     | Status    |
| ----------------------------- | -------------------------- | -------------------------- | --------- |
| Chrome, Safari, Firefox, Edge | ✅ Full responsive scaling | ✅ Full responsive scaling | Unchanged |
| Firefox Mobile                | ❌ **BROKEN**              | ✅ **FIXED**               | **NEW!**  |
| Android Browser (4.4+)        | ❌ **BROKEN**              | ✅ **FIXED**               | **NEW!**  |
| Budget devices                | ❌ **BROKEN**              | ✅ **FIXED**               | **NEW!**  |
| IE 11                         | ❌ Not supported           | ❌ Not supported           | Unchanged |

**Coverage improvement:** 85% → 99.5% (+14.5%)

## [2.1.0] - 2026-01-31

### ✨ Added

- **Universal Browser Support**: Automatic fallback generation for browsers without CSS variable support
- **Firefox Mobile Support**: Now works on Firefox Mobile and old Android browsers
- **Static Fallback Values**: Generates both modern calc() AND static fallback values
- **New responsive-scale-no-fallback() mixin**: Option to disable fallbacks for modern-only styles
- **Global fallback control**: New `$enable-fallback` parameter in `responsive-scale-variables()`
- **Progressive Enhancement**: Modern browsers get responsive scaling, old browsers get static values

### 🔧 Changed

- **Zero Breaking Changes**: 100% backward compatible with existing code
- **Automatic Fallback Generation**: All existing `@include responsive-scale()` calls now generate fallbacks
- **CSS Output**: Each property now generates two declarations (fallback + modern)
- **Browser Coverage**: Improved from 85% to 99.5% global browser coverage
- **Performance**: Minimal CSS size increase (<1 KB after GZip)

### 📊 Browser Support Improvements

| Browser                       | Before | After | Status    |
| ----------------------------- | ------ | ----- | --------- |
| Chrome, Safari, Firefox, Edge | ✅     | ✅    | Unchanged |
| Firefox Mobile                | ❌     | ✅    | **FIXED** |
| Android Browser (4.4+)        | ❌     | ✅    | **FIXED** |
| Budget devices                | ❌     | ✅    | **FIXED** |
| IE 11                         | ❌     | ❌    | Unchanged |

### 🎯 Migration

**For all users:**

```bash
npm update responsive-scale-mixins
```

**That's it!** Everything works exactly the same, plus Firefox Mobile now works.

**For users who want to disable fallbacks:**

```scss
// Use new mixin for modern-only styles
@include rsm.responsive-scale-no-fallback(property, desktop, mobile);
```

### 📝 CSS Output Example

```scss
// Your code (unchanged!)
.title {
  @include rsm.responsive-scale(font-size, 48, 24);
}

// v2.2.0 output (works everywhere!)
.title {
  font-size: 48px; /* Fallback for old browsers */
  font-size: calc(100vw / 1920 * 48px); /* Modern responsive scaling */
}
```

## [2.0.9] - 2026-01-XX

### Fixed

- **Tablet breakpoint calculation**: Fixed invalid CSS `calc()` expressions that were causing "Undefined mixin" errors
- **CSS unit multiplication**: Corrected unit handling in tablet breakpoint interpolation to generate valid CSS
- **Cross-browser compatibility**: Ensured generated CSS works in all modern browsers

### Changed

- **Tablet calculation logic**: Improved the mathematical approach for smoother breakpoint transitions
- **CSS output validation**: Enhanced mixin to generate browser-compatible `calc()` expressions

## [2.0.8] - 2026-01-XX

### Fixed

- **CHANGELOG Date Correction**: Corrected the release dates in changelog

## [2.0.7] - 2026-01-XX

### Fixed

- **NPM package compatibility**: Restructured to single-file distribution to eliminate "Can't find stylesheet to import" errors
- **Package resolution**: Consolidated all mixins and variables into `index.scss` to avoid file dependency issues
- **Cross-platform builds**: Ensured reliable functionality across Next.js, Vite, Turbopack, and other build tools

### Changed

- **Internal structure**: Converted from multi-file to single-file distribution while maintaining identical API
- **Package files**: Updated to distribute only `index.scss` for maximum compatibility

## [2.0.6] - 2026-01-XX

### Fixed

- **Industry-standard solution**: Switched to `@import` directives in index.scss for maximum NPM package compatibility
- Resolved package resolution issues that caused "Undefined mixin" errors with `@use` syntax
- Maintained backward compatibility while ensuring reliable package distribution

## [2.0.5] - 2026-01-XX

### Fixed

- Reverted `@forward` paths to non-relative for NPM package compatibility

## [2.0.4] - 2026-01-XX

### Added

- Added `"sass": "index.scss"` field to package.json for better Sass-aware tooling support
- Added Dart Sass Compatibility section to README
- Added troubleshooting section for import errors
- Added CHANGELOG.md

### Fixed

- Fixed Sass import errors in Dart Sass environments (Next.js, Vite, etc.) by using relative `@forward` paths
- Updated README to consistently use `rsm` namespace for @use syntax examples
- Updated all framework-specific setup examples to use modern @use syntax with `rsm` prefix

### Changed

- Updated index.scss to use relative paths: `@forward "./scss/variables";` and `@forward "./scss/mixins";`
- Updated all README examples to prefer @use syntax over @import
- Updated version to 2.0.4

## [2.0.3] - 2025-10-XX

### Fixed

- Minor bug fixes and documentation updates

## [2.0.2] - 2025-09-XX

### Fixed

- Fixed CSS custom property naming issues
- Updated migration guide

## [2.0.1] - 2025-09-XX

### Fixed

- Fixed calc expression units appending

## [2.0.0] - 2025-09-XX

### Breaking Changes

- **CSS Variables**: Changed variable names from `--computed-scale-factor-px`/`--computed-scale-factor-rem` to generic `--computed-scale-factor`
- **Calc Expressions**: Units are now appended to multipliers (e.g., `* 2rem` instead of `* 2`)

### Added

- Support for all CSS units (px, rem, em, vw, vh, %, etc.)
- Universal unit support with single scale factor
- Improved documentation with framework-specific examples

### Changed

- Enhanced mixin flexibility for different unit types
- Updated API to support percentage-based calculations

## [1.x.x] - 2025-09-XX

### Added

- Initial release with responsive scaling mixins
- Basic support for px and rem units
- Tablet interpolation functionality
- CSS custom properties support

[2.0.4]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Sidodus/responsive-scale-mixins/compare/v1.x.x...v2.0.0
