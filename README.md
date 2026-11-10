# 🚀 Responsive Scale Mixins

## **The Future of Responsive Design is Here**

**Stop wrestling with breakpoints. Start designing once, deploy everywhere.**

Imagine building a beautiful UI in Figma, then seeing it perfectly scale on **every screen size** - from tiny phones (320px) to ultra-wide monitors (9999px) - without writing a single media query. That's the power of Responsive Scale Mixins.

[![npm version](https://badge.fury.io/js/responsive-scale-mixins.svg)](https://www.npmjs.com/package/responsive-scale-mixins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/responsive-scale-mixins)](https://www.npmjs.com/package/responsive-scale-mixins)
[![npm](https://img.shields.io/npm/dm/responsive-scale-mixins)](https://www.npmjs.com/package/responsive-scale-mixins)

## 🔥 Why Developers Love It

### 🎯 Pixel-Perfect Figma Translation

- Your Figma designs become reality, not approximations
- Zero guessing, zero manual calculations
- What you see in design tools is what users see on any device

### ⚡ Revolutionary Simplicity

```scss
// Before: 50+ lines of media queries
.hero-title {
  font-size: 48px;
  @media (max-width: 768px) {
    font-size: 32px;
  }
  @media (max-width: 480px) {
    font-size: 24px;
  }
  // ... and so on for every element
}

// After: 1 line that works everywhere
.hero-title {
  @include rsm.responsive-scale(font-size, 48, 24);
}
```

### 🎨 Universal Unit Support

- **px, rem, em, vw, vh, %, cm, mm, in, pt, pc** - you name it, we scale it
- Intelligent interpolation between desktop and mobile values
- Perfect scaling from 320px phones to 8K displays

### 🚀 Framework Agnostic

Works with React, Vue, Angular, Svelte, Next.js, Nuxt, Astro, and vanilla CSS. Your favorite framework + perfect responsive design = ❤️

## 🚀 What's New in v2.4.0

**Bounded fluid scaling and one-line configuration.**

- **✅ Clamp bounds**: pass `$min` / `$max` to keep fluid values inside a
  range - `responsive-scale(font-size, 48, 24, $min: 24, $max: 48)` emits
  `clamp(24px, <fluid>, 48px)` on every breakpoint. One-sided bounds emit
  `max()` / `min()`. Verified to survive cssnano (Next.js) and esbuild (Vite)
  minification unchanged; pre-2020 browsers simply keep the static fallback.
- **✅ Breakpoint map configuration**: `@use ... with ($rsm-breakpoints:
  (desktop: 1440px, mobile: 375px))` as a one-line alternative to the three
  individual width variables.
- **✅ `breakpoints()` function**: read the effective design widths to align
  your own media queries.
- **✅ Live demo**: fluid-scaling showcase deployable to GitHub Pages
  ([`docs/demo/`](docs/demo/index.html)).

## 🚀 What's New in v2.3.0

**Design widths are now real module configuration - and the math is finally continuous.**

- **✅ Breakpoints that actually follow your widths**: set `$rsm-desktop-width` /
  `$rsm-mobile-width` via Sass module configuration and BOTH the `calc()`
  expressions and the media-query breakpoints follow - in every compiled
  stylesheet, regardless of file or load order. Previously, widths set from
  `globals.scss` silently failed to reach components compiled separately, and
  the only workaround was editing the package source.
- **✅ Continuous interpolation**: the tablet formula was mathematically broken
  since v1 (it multiplied the interpolated value by `100vw / tablet-width`),
  inflating mid-range values (~70px on a 1366px laptop for a 48px design) with
  2-2.5x jumps at the breakpoint boundaries. The new curve is exactly the
  linear blend between your mobile and desktop design values.
- **✅ Stronger CSS output**: no CSS variables, no division-by-a-length
  (unsupported before 2023 *and* mangled into invalid CSS by current Dart
  Sass). px-style values are emitted as pure vw lengths that scale even in
  browsers without `calc()` support. Fluid declarations stay wrapped in
  `@supports` because production minifiers (cssnano in Next.js/CRA) would
  otherwise prune the static fallback pair - verified in real Next.js and
  Vite builds.
- **✅ Zero-config requirement**: `responsive-scale-variables()` is now optional.
- **✅ Clear validation errors** instead of silently invalid CSS.

See [CHANGELOG.md](CHANGELOG.md) for the full list and migration notes.

## 📱 How the Breakpoints Work

The design widths define a curve that is **continuous at every breakpoint**:

| Range | Rule |
| --- | --- |
| `viewport ≤ mobile-width − 1` | `mobile-value × viewport / mobile-width` |
| `mobile-width … desktop-width − 1` | linear blend from mobile-value to desktop-value |
| `viewport ≥ desktop-width` | `desktop-value × viewport / desktop-width` |

With the default widths (desktop 1920px, mobile 390px), a
`responsive-scale(font-size, 48, 24)` renders:

| Viewport | Rendered size |
| --- | --- |
| 390px | 24px (mobile design value) |
| 768px | ≈29.9px |
| 1366px | ≈39.3px |
| 1919px | ≈47.9px |
| 1920px | 48px (desktop design value) |

No jumps, no inflation - exactly the proportions you designed.

## ⚙️ Configuring Your Design Widths

**This is the single most important section.** The breakpoints are derived from
three module variables (defaults: desktop `1920px`, tablet `768px`, mobile
`390px`):

| Variable | Meaning |
| --- | --- |
| `$rsm-desktop-width` | Design canvas width for desktop (e.g. your Figma frame) |
| `$rsm-tablet-width` | Legacy - only feeds `--computed-tablet-scale-factor` |
| `$rsm-mobile-width` | Design canvas width for mobile |

### Option A (recommended): `@use ... with (...)`

Individual width variables:

```scss
// Any stylesheet that needs the mixins
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-tablet-width: 768px,
  $rsm-mobile-width: 375px
);

.my-element {
  @include rsm.responsive-scale(font-size, 48, 24);
}
```

...or the equivalent one-map form (v2.4):

```scss
@use "responsive-scale-mixins" as rsm with (
  $rsm-breakpoints: (desktop: 1440px, tablet: 768px, mobile: 375px)
);
```

`desktop` and `mobile` are required, `tablet` is optional. The two forms are
mutually exclusive - mixing them fails with a clear error.

Module configuration is applied when the module is loaded, so it works
regardless of rule order and reaches **every** stylesheet compiled with that
configuration.

**Recommended pattern for real projects** - create one project-owned wrapper
file and import it everywhere:

```scss
// styles/_rsm.scss  (your file, lives in your repo)
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);
@forward "responsive-scale-mixins";
```

```scss
// any component / page stylesheet
@use "../styles/rsm" as rsm;

.card {
  @include rsm.responsive-scale(padding, 32 48, 16 24);
}
```

Because every compilation unit loads your wrapper, the configured widths are
guaranteed - even in build tools that compile each stylesheet separately
(Next.js CSS Modules, Angular component styles, Vite, ...).

> ⚠️ Sass can configure a module only once per compilation, and only at its
> **first** load. Configure it in your wrapper (or entry) file - not twice.

### Option B: `responsive-scale-variables()` mixin (legacy, single-compile builds)

```scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Must run BEFORE any responsive-scale() include in the same compilation
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
}
```

Since v2.3.0 this mixin is **optional** - the scaling mixins no longer depend
on CSS variables. It still:

1. emits the legacy custom properties (`--computed-scale-factor` and friends)
   for hand-written styles that reference them;
2. sets the fallback flag / widths at runtime - but `!global` mutation only
   affects the **current compilation unit** and only for `responsive-scale()`
   includes that come **after** it. That is precisely why widths set this way
   never reached separately-compiled components in v2.2.x and earlier.

### Option C: legacy `@import` (old builds)

```scss
// Set the variables BEFORE the import - the classic !default override pattern
$rsm-desktop-width: 1440px;
$rsm-mobile-width: 375px;
@import "responsive-scale-mixins";

.my-element {
  @include responsive-scale(font-size, 48, 24);
}
```

## 🚀 Quick Start

### Installation

```bash
npm install responsive-scale-mixins
# or: yarn add responsive-scale-mixins
# or: pnpm add responsive-scale-mixins
```

### Minimal usage (no global setup required)

```scss
@use "responsive-scale-mixins" as rsm;

.hero-title {
  @include rsm.responsive-scale(font-size, 48, 24);
}
```

### Framework-Specific Setup

#### Next.js (App Router & Pages Router)

```scss
// app/globals.scss  (or styles/globals.scss)
@use "responsive-scale-mixins" as rsm;

:root {
  // Optional: emit the legacy CSS variables for custom styles
  @include rsm.responsive-scale-variables();
}
```

Components compiled as CSS Modules load their own copy of the module. Add the
configuration to **every compilation** via `sassOptions`:

```js
// next.config.js
module.exports = {
  sassOptions: {
    additionalData: `@use "responsive-scale-mixins" as rsm with (
      $rsm-desktop-width: 1440px,
      $rsm-mobile-width: 375px
    );`,
  },
};
```

> ⚠️ **Pick ONE configuration channel.** `additionalData` prepends the config
> to *every* compiled stylesheet, so your own files must NOT configure the
> module again (`@use "responsive-scale-mixins" as rsm;` without `with (...)`
> is fine - Sass reuses the already-configured module). Configuring twice
> fails with *"This module was already loaded, so it can't be configured
> using with"*. If you prefer the wrapper-file pattern, inject
> `@use "styles/rsm" as rsm;` via `additionalData` instead and drop the
> injected module config.

#### Vite (Vue / React / SvelteKit / Astro)

```ts
// vite.config.ts
export default {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "responsive-scale-mixins" as rsm with (
          $rsm-desktop-width: 1440px,
          $rsm-mobile-width: 375px
        );`,
      },
    },
  },
};
```

#### Create React App

```scss
// src/index.scss
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);

:root {
  @include rsm.responsive-scale-variables();
}
```

#### Angular

Angular compiles component styles separately. Configure once in
`src/styles.scss` **and** make the widths available to components with the
wrapper pattern:

```scss
// src/_rsm.scss
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);
@forward "responsive-scale-mixins";
```

```scss
// src/styles.scss
@use "./rsm" as rsm;

:root {
  @include rsm.responsive-scale-variables();
}
```

```scss
// any component.scss
@use "../rsm" as rsm;

.card {
  @include rsm.responsive-scale(padding, 32 48, 16 24);
}
```

#### Vue.js / Nuxt.js

```scss
// src/assets/styles/main.scss (registered globally)
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);

:root {
  @include rsm.responsive-scale-variables();
}
```

For scoped component styles, use the wrapper-file pattern or `additionalData`
(Vite/Nuxt config shown above).

#### CSS Modules

```scss
// styles/global.scss  - widths for the whole app
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);

// styles.module.scss  - any module
@use "responsive-scale-mixins" as rsm; // same compilation = same widths

.myClass {
  @include rsm.responsive-scale(font-size, 24, 16);
}
```

> Modules compiled **separately** need the wrapper-file pattern or
> `additionalData` injection - otherwise they get the default widths.

#### Tailwind CSS

```scss
// styles/main.scss
@use "responsive-scale-mixins" as rsm with (
  $rsm-desktop-width: 1440px,
  $rsm-mobile-width: 375px
);

.custom-element {
  @include rsm.responsive-scale(padding, 20 40, 10 20);
  @apply bg-blue-500 text-white; // Tailwind classes still work
}
```

### Pure CSS alternative (no Sass)

```css
:root {
  --computed-scale-factor: calc(100vw / 1440);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / 1065);
}
```

## 📖 API Reference

### `responsive-scale-variables($desktop-width, $tablet-width, $mobile-width, $enable-fallback)`

*Optional since v2.3.0.* Emits the legacy CSS custom properties and sets the
runtime fallback flag. Parameter defaults follow the module configuration, so
calling it with no arguments never resets your `@use with` widths.

### `responsive-scale($property, $desktop-value, $mobile-value, $unit, $is-percentage, $desktop-relative, $mobile-relative, $important, $enable-fallback, $min, $max)`

The main responsive scaling mixin.

**Parameters:**

- `$property`: CSS property name (e.g. `font-size`, `padding`)
- `$desktop-value`: unitless value at the desktop design width (or a space list for shorthand properties)
- `$mobile-value`: unitless value at the mobile design width (must match list-ness/length of `$desktop-value`)
- `$unit`: `px` (default), `rem`, `em`, `%`, `vw`, `vh`, `vmin`, `vmax`, `pt`, `cm`, `mm`, `in`, `pc` - pass without quotes
- `$is-percentage`: `true` to treat the value as a percentage of `$desktop-relative`/`$mobile-relative`
- `$desktop-relative` / `$mobile-relative`: the base values for percentage mode
- `$important`: `true`, or a string like `" !important"`
- `$enable-fallback`: `null` (follow the global flag), `true`, or `false`
- `$min` / `$max` (v2.4): optional unitless bounds (same `$unit`) applied to every fluid declaration:

```scss
// Classic bounded pattern: never smaller than the mobile value,
// never larger than the desktop value
.hero-title {
  @include rsm.responsive-scale(font-size, 48, 24, $min: 24, $max: 48);
}
// -> clamp(24px, <fluid>, 48px) on desktop, tablet and mobile branches

// One-sided bounds emit max() / min():
.element {
  @include rsm.responsive-scale(padding, 32 48, 16 24, $max: 48);
}
// -> min(48px, <fluid>) on each scaled element
```

Bounds apply to the fluid declarations only - static fallbacks keep the
design values. Bounds share the `$unit` and cannot be combined with
`$is-percentage`. On browsers without `clamp()` support (pre-2020) the
declaration is dropped and the static fallback applies, exactly like every
other fluid form.

**Generated CSS** (default fallbacks on):

```css
.hero-title {
  font-size: 48px;                        /* static fallback */
}

@supports (font-size: 2.5vw) {
  .hero-title {
    font-size: 2.5vw;                     /* fluid - pure vw, works without calc() */
  }
}

@media screen and (min-width: 390px) and (max-width: 1919px) {
  .hero-title {
    font-size: 24px;                      /* static fallback */
  }

  @supports (font-size: calc(24px + (100vw - 390px) * 24 / 1530)) {
    .hero-title {
      font-size: calc(24px + (100vw - 390px) * 24 / 1530);  /* continuous interpolation */
    }
  }
}

@media screen and (max-width: 389px) {
  .hero-title {
    font-size: 24px;                      /* static fallback */
  }

  @supports (font-size: 6.1538461538vw) {
    .hero-title {
      font-size: 6.1538461538vw;          /* fluid */
    }
  }
}
```

Browsers that cannot parse a fluid declaration keep the static one. The
`@supports` wrapper is deliberately kept even though the expressions are now
universally valid: production CSS minifiers (cssnano in Next.js/Create React
App) prune earlier same-property declarations for mergeable box properties,
which would otherwise silently delete the static fallback pair. Unit-preserving
values (rem/em/%/vw/vh) emit a same-type-division `calc()` (e.g.
`calc(3rem / 1920px * 100vw)`), which is supported by 2023+ browsers and falls
back to the static value elsewhere.

### `responsive-scale-no-fallback(...)`

Same parameters minus `$enable-fallback`; emits fluid declarations only.

### `breakpoint($name)`

Returns the configured width for `"desktop"`, `"tablet"` or `"mobile"` - handy
for aligning your own media queries:

```scss
@media (min-width: rsm.breakpoint("desktop")) { ... }
```

### `breakpoints()` (v2.4)

Returns the effective design widths as a map (after any `$rsm-breakpoints`
configuration):

```scss
@use "sass:map";
@media (min-width: map.get(rsm.breakpoints(), desktop)) { ... }
```

### `strip-units($value)`, `scaled-value($val, $width, $unit)`, `tablet-interpolation($desktop-value, $mobile-value, $unit)`, `mobile-scale-expression($mobile-value, $unit)`

Utility functions used by the mixins; exposed for advanced use.

## 🎯 Examples

### Typography

```scss
.hero-title {
  @include rsm.responsive-scale(font-size, 48, 32);
  @include rsm.responsive-scale(line-height, 1.2, 1.3);
  @include rsm.responsive-scale(letter-spacing, -1, -0.5);
}
```

### Spacing

```scss
.card {
  @include rsm.responsive-scale(padding, 32 48, 16 24);
  @include rsm.responsive-scale(margin-bottom, 24, 16);
}
```

### Dimensions

```scss
.button {
  @include rsm.responsive-scale(width, 200, 150);
  @include rsm.responsive-scale(height, 56, 44);
  @include rsm.responsive-scale(border-radius, 8, 6);
}
```

### Percentage-based Properties

```scss
.text {
  // Letter-spacing as 1% of font-size
  @include rsm.responsive-scale(letter-spacing, 1, 1, px, true, 48, 32);
}
```

### REM and EM Units

```scss
.element {
  @include rsm.responsive-scale(font-size, 3, 2, rem);
  @include rsm.responsive-scale(font-size, 2, 1.5, em);
}
```

### Bounded (Clamped) Scaling

```scss
// Value never shrinks below 24px and never grows above 48px -
// even on ultra-narrow (≤390px) or ultra-wide (≥1920px) screens
.hero-title {
  @include rsm.responsive-scale(font-size, 48, 24, $min: 24, $max: 48);
}
```

### Override Specificity

```scss
.override-bootstrap {
  @include rsm.responsive-scale(font-size, 24, 16, px, false, null, null, true);
}
```

## 🌐 Browser Support

| Browser | Behavior |
| --- | --- |
| Chrome / Edge / Firefox / Safari (2023+) | Full fluid scaling everywhere ([`calc()` same-type division](https://caniuse.com/calc)) |
| Chrome / Edge / Firefox / Safari (2013–2022) | Fluid px scaling; static values for rem/em/%/vh |
| Chrome 79+ / Firefox 75+ / Safari 13.1+ (2020) | `$min`/`$max` bounds honored via [`clamp()`](https://caniuse.com/css-clamp) / [`min()`/`max()`](https://developer.mozilla.org/docs/Web/CSS/min) |
| Browsers with `vw` but without `calc()` (IE9+, [viewport units](https://caniuse.com/viewport-units)) | Fluid px scaling |
| Very old browsers (no `vw`) | Static fallback values at each breakpoint |
| IE 11 | Fluid px scaling; static for unit-preserving values and bounds |

Every declaration ships with a static fallback, so **nothing is ever blank** -
the original Firefox Mobile bug is structurally impossible now that the output
contains no CSS variables, and unsupported fluid forms (including `clamp()`
bounds on pre-2020 browsers) simply fall back to the static value.

## 🔧 Troubleshooting

### "My custom widths from globals.scss don't change the breakpoints"

Sass modules are loaded **per compilation unit**. A `!global` mutation (the
v2.2.x `responsive-scale-variables()` mechanism) only reaches mixin calls in
the *same* compiled stylesheet, and only if it runs *before* them. Components
compiled separately (Next.js/Angular/Vite CSS Modules) load a fresh module
with the default widths.

**Fix**: use Option A (`@use ... with (...)` + wrapper file or
`additionalData` injection). That is what it was added for.

### "This module was already loaded, so it can't be configured using with"

The module was loaded earlier in the same compilation without configuration.
Configure it at the first load - in the wrapper file pattern, the wrapper is
always first.

### "Compilation error: value must be a unitless number"

v2.3.0 validates inputs. Pass `48` (the unit is the separate `$unit`
parameter), not `48px`.

### Import resolution errors ("Can't find stylesheet")

- Ensure v2.3.0+ and the `@use "responsive-scale-mixins" as rsm;` syntax
- Some bundlers need the package added to their Sass `loadPaths`
- Legacy fallback: `@import "responsive-scale-mixins";`

## 🛠 Development

```bash
npm install
npm test          # assertion test suite (test/run-tests.js)
```

The test suite compiles representative stylesheets through the Dart Sass JS
API and asserts on the generated CSS, including numeric verification that the
interpolation curve is continuous at the breakpoint boundaries.

Manual visual testing:

```bash
npx --yes sass test/test.scss test/test.css
# then open test/test.html in a browser and resize the window
```

See [`test/TEST_README.md`](test/TEST_README.md) for details.

### Live demo

```bash
# Local preview
mkdir -p node_modules/responsive-scale-mixins && cp index.scss node_modules/responsive-scale-mixins/index.scss
npx sass --load-path=node_modules docs/demo/demo.scss docs/demo/demo.css
# then open docs/demo/index.html in a browser
```

Pushing to `main` deploys `docs/demo/` to GitHub Pages automatically via
[`.github/workflows/deploy-demo.yml`](.github/workflows/deploy-demo.yml)
(one-time setup: **Settings → Pages → Source: "GitHub Actions"**).

### Releasing (maintainers)

npm publishing is **manual** - run `npm publish` yourself when the tree is
ready (the sanity checklist in [AGENTS.md](AGENTS.md) is the pre-flight gate).
GitHub Actions assists with everything else via
[`.github/workflows/release.yml`](.github/workflows/release.yml):

1. Bump the version in `package.json` and the `index.scss` header, update `CHANGELOG.md`, commit
2. Publish manually: `npm publish` (use `--otp=<code>` if 2FA is enabled)
3. Tag and push: `git tag v2.4.0 && git push origin v2.4.0`
4. The workflow verifies the tag matches `package.json`, runs the test suite, validates the tarball, and creates the GitHub Release

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Agents contributing to this repository should read [AGENTS.md](AGENTS.md)
first for architecture invariants and workflow.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Figma's responsive design principles
- Built for modern web development workflows
- Compatible with CSS Modules, Styled Components, and traditional CSS

## 📞 Support

- 🌐 **Live Demo: [https://sidodus.github.io/responsive-scale-mixins/](https://sidodus.github.io/responsive-scale-mixins/)**
- 📧 Email: saheedodulaja@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Sidodus/responsive-scale-mixins/issues)
- 📖 Docs: [Full Documentation](https://github.com/Sidodus/responsive-scale-mixins#readme)
- 📦 NPM: [https://www.npmjs.com/package/responsive-scale-mixins](https://www.npmjs.com/package/responsive-scale-mixins)
- 👤 NPM Profile: [https://www.npmjs.com/~sidodus](https://www.npmjs.com/~sidodus)

---

**Made with ❤️ by [Saheed Odulaja](https://github.com/Sidodus)**
