# 🚀 Responsive Scale Mixins

## **The Future of Responsive Design is Here**

**Stop wrestling with breakpoints. Start designing once, deploy everywhere.**

Imagine building a beautiful UI in Figma, then seeing it perfectly scale on **every screen size** - from tiny phones (320px) to ultra-wide monitors (9999px) - without writing a single media query. That's the power of Responsive Scale Mixins.

[![npm version](https://badge.fury.io/js/responsive-scale-mixins.svg)](https://www.npmjs.com/package/responsive-scale-mixins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/responsive-scale-mixins)](https://www.npmjs.com/package/responsive-scale-mixins)
[![npm](https://img.shields.io/npm/dm/responsive-scale-mixins)](https://www.npmjs.com/package/responsive-scale-mixins)

## 🔥 **Why Developers Love It**

### **🎯 Pixel-Perfect Figma Translation**

- Your Figma designs become reality, not approximations
- Zero guessing, zero manual calculations
- What you see in design tools is what users see on any device

### **⚡ Revolutionary Simplicity**

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

### **🎨 Universal Unit Support**

- **px, rem, em, vw, vh, %, cm, mm, in, pt, pc** - you name it, we scale it
- Intelligent interpolation between desktop and mobile values
- Perfect scaling from 320px phones to 8K displays

### **🚀 Framework Agnostic**

Works with React, Vue, Angular, Svelte, Next.js, Nuxt, Astro, and vanilla CSS. Your favorite framework + perfect responsive design = ❤️

## 🚀 v2.2.0 - Universal Browser Compatibility (No Breaking Changes)

**Automatic fallback generation for browsers without CSS variable support!**

### **✨ What's New**

- **Universal Browser Support**: Now works on Firefox Mobile, old Android browsers, and budget devices
- **Automatic Fallbacks**: Generates both modern calc() AND static fallback values
- **Zero Code Changes**: Your existing code works exactly the same
- **Progressive Enhancement**: Modern browsers get responsive scaling, old browsers get static values

### **🎯 Browser Support Matrix**

| Browser                       | v2.0.x                     | v2.1.0                     | Status    |
| ----------------------------- | -------------------------- | -------------------------- | --------- |
| Chrome, Safari, Firefox, Edge | ✅ Full responsive scaling | ✅ Full responsive scaling | Unchanged |
| Firefox Mobile                | ❌ **BROKEN**              | ✅ **FIXED**               | **NEW!**  |
| Android Browser (4.4+)        | ❌ **BROKEN**              | ✅ **FIXED**               | **NEW!**  |
| Budget devices                | ❌ **BROKEN**              | ✅ **FIXED**               | **NEW!**  |
| IE 11                         | ❌ Not supported           | ❌ Not supported           | Unchanged |

**Coverage improvement:** 85% → 99.5% (+14.5%)

### **🔧 How It Works**

```scss
// Your code (unchanged!)
.hero-title {
  @include rsm.responsive-scale(font-size, 48, 24);
}

// v2.0.x output (broken on Firefox Mobile)
.hero-title {
  font-size: calc(100vw / 1920 * 48px);
}

// v2.1.0 output (works everywhere!)
.hero-title {
  font-size: 48px; /* Fallback for old browsers */
}

@supports (font-size: calc(100vw / 1920px * 48px)) {
  .hero-title {
    font-size: calc(100vw / 1920px * 48px); /* Modern responsive scaling */
  }
}
```

**Browser behavior:**

- **Modern browsers**: Ignore first declaration, use second → Perfect responsive scaling ✅
- **Old browsers**: Use first declaration, ignore second → Static fallback values ✅

### **⚙️ New Optional Features**

#### Disable Fallback for Single Property

```scss
// Don't generate fallback for this property (modern browsers only)
.element {
  @include rsm.responsive-scale-no-fallback(font-size, 48, 24);
}
```

#### Disable Fallback Globally

```scss
:root {
  @include rsm.responsive-scale-variables(
    1920px,
    768px,
    390px,
    false // No fallbacks anywhere
  );
}
```

> Note: Setting the last argument to `false` disables fallback output globally for all `rsm.responsive-scale()` calls. Individual declarations can still override this behavior by passing the `$enable-fallback` parameter explicitly.

### **📊 Performance Impact**

- **CSS size increase**: <1 KB (after GZip) on typical sites
- **Build time**: No change
- **Runtime performance**: No change
- **Browser parsing**: Slightly faster on old browsers

### **🔄 Migration Guide**

**For all users:**

```bash
npm update responsive-scale-mixins
```

**That's it!** Everything works, plus Firefox Mobile now works.

**For users who want to disable fallbacks:**

```scss
// Use new mixin for modern-only styles
@include rsm.responsive-scale-no-fallback(property, desktop, mobile);
```

### **✅ v2.0.9 - Bug Fix (No Breaking Changes)**

**This is a bug fix that resolves tablet breakpoint calculation issues. No API changes.**

- **Fixed**: Tablet breakpoint CSS generation was producing invalid `calc()` expressions
- **Result**: Tablet scaling now works correctly with valid CSS output
- **Compatibility**: All existing code continues to work unchanged
- **API**: Zero breaking changes - same function calls, same parameters, same behavior

### Migration Guide (Pure CSS Users)

**Update your CSS variable definitions:**

```css
/* OLD (v1.x) */
:root {
  --computed-scale-factor-px: calc(100vw / 1440);
  --computed-scale-factor-rem: calc(100vw / 1440 / 16);
  --computed-tablet-scale-factor-px: calc(100vw / 768);
  --computed-tablet-scale-factor-rem: calc(100vw / 768 / 16);
  --computed-mobile-scale-factor-px: calc(100vw / 375);
  --computed-mobile-scale-factor-rem: calc(100vw / 375 / 16);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

/* NEW (v2.0) */
:root {
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}
```

**Update your calc expressions to include units:**

```css
/* OLD (v1.x) */
font-size: calc(var(--computed-scale-factor-px) * 40);

/* NEW (v2.0+) */
font-size: calc(var(--computed-scale-factor) * 40px);

@include rsm.responsive-scale(font-size, 24, 16);
```

## ✨ Features

- **Figma Proportions**: Maintains exact proportions from your Figma designs
- **Automatic Scaling**: No manual breakpoint calculations needed
- **Tablet Interpolation**: Smart interpolation between mobile and desktop values
- **CSS Custom Properties**: Uses modern CSS variables for optimal performance
- **Framework Agnostic**: Works with any CSS framework or vanilla CSS
- **TypeScript Ready**: Compatible with CSS Modules and CSS-in-JS solutions
- **Universal Unit Support**: Handles all CSS units including absolute (px, pt, cm, mm, in, pc) and relative (%, em, rem, vw, vh, vmin, vmax) units

## 🔧 Package Structure

**Starting with v2.0.7**, this package uses a **single-file distribution** for maximum compatibility. All mixins and functions are consolidated in `index.scss`, eliminating import dependency issues that could occur with NPM package distribution.

### Recommended Import Pattern

```scss
// Modern @use syntax (preferred)
@use "responsive-scale-mixins" as rsm;

:root {
  @include rsm.responsive-scale-variables();
}

.my-element {
  @include rsm.responsive-scale(font-size, 24, 16);
}
```

### Troubleshooting Import Errors

If you encounter "Can't find stylesheet to import" errors with Dart Sass:

1. **Update the package**: Ensure you're using v2.0.4 or later
2. **Use relative imports as workaround**: Import the partials directly:
   ```scss
   @import "responsive-scale-mixins/scss/variables";
   @import "responsive-scale-mixins/scss/mixins";
   ```
3. **Check your build tool**: Some tools may need configuration updates for SCSS module resolution

## 🚀 Quick Start

### Installation

#### npm

```bash
npm install responsive-scale-mixins
```

#### Yarn

```bash
yarn add responsive-scale-mixins
```

#### pnpm

```bash
pnpm add responsive-scale-mixins
```

### Framework-Specific Setup

#### Next.js (App Router)

```scss
// app/globals.scss or app/styles/globals.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  // Define CSS variables globally (required)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}

// Import in app/layout.tsx: import './globals.scss'
```

### Regression Test

To confirm the fix before publishing, run the local regression case included in `test/regression.scss`.

```bash
cd test
./test.sh
```

If the build succeeds, verify that `test/regression.css` was generated and contains valid modern expressions such as:

```css
padding: calc(
    var(--computed-tablet-scale-factor) *
      (5px + var(--tablet-proportion-scale-factor) * (10px - 5px))
  )
  calc(
    var(--computed-tablet-scale-factor) *
      (10px + var(--tablet-proportion-scale-factor) * (20px - 10px))
  );
```

Then verify the `@supports` output for the single-value case in `test.css` matches the corrected form:

```css
@supports (margin: calc(100vw / 1920px * 10px)) {
  .bar {
    margin: calc(100vw / 1920px * 10px);
  }
}
```

#### Next.js (Pages Router)

```scss
// styles/globals.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}

// Import in pages/_app.js: import '../styles/globals.scss'
```

**Next.js Setup:**

- **App Router**: Put `:root` in `app/globals.css` (imported in `layout.tsx`)
- **Pages Router**: Put `:root` in `styles/globals.scss` (imported in `pages/_app.js`)
- The `:root` selector defines global CSS custom properties accessible everywhere

#### Create React App

```scss
// src/index.scss or src/styles/main.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}

// Import in src/index.js: import './index.scss'
```

**Create React App Setup:**

- Put `:root` in your main SCSS file (e.g., `src/index.scss`)
- Import the SCSS file in `src/index.js`
- The `:root` selector makes CSS variables available app-wide

#### Vue.js

```scss
// src/assets/styles/main.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}

// Import in src/main.js: import './assets/styles/main.scss'
```

**Vue.js Setup:**

- Put `:root` in your global SCSS file
- Import in `src/main.js` or use in a global style resource
- The `:root` selector defines app-wide CSS variables

#### Angular

```scss
// src/styles.scss (global styles)
@use "responsive-scale-mixins" as rsm;

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}

// This file is automatically included by Angular CLI
```

**Angular Setup:**

- Put `:root` in `src/styles.scss` (automatically included by Angular CLI)
- No manual import needed - Angular handles it
- The `:root` selector defines global CSS variables

#### Vite + Vue/React

```scss
// src/styles/main.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}
```

#### Gatsby

```scss
// src/styles/global.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}
```

#### Nuxt.js

```scss
// assets/styles/main.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}
```

#### SvelteKit

```scss
// src/app.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}
```

#### Astro

```scss
// src/styles/global.scss
@use "responsive-scale-mixins" as rsm;

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}
```

#### CSS Modules

```scss
// styles.module.scss
@use "responsive-scale-mixins" as rsm;

// Variables must be in global scope
// In your main CSS file:
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1920);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 390);
  --tablet-proportion-scale-factor: calc((100vw - 390px) / (1920px - 390px));
}

// Then in your module
.myClass {
  @include rsm.responsive-scale(font-size, 24, 16);
}
```

#### Tailwind CSS Integration

```scss
// styles/main.scss
@use "responsive-scale-mixins" as rsm;

:root {
  @include rsm.responsive-scale-variables();
}

// Use alongside Tailwind
.custom-element {
  @include rsm.responsive-scale(padding, 20 40, 10 20);
  @apply bg-blue-500 text-white; // Tailwind classes still work
}
```

#### Styled Components

```scss
// If using styled-components with SCSS preprocessing
import styled from 'styled-components';
import './styles/responsive-mixins.scss'; // Import in your main file

const StyledComponent = styled.div`
  ${props => props.theme.responsiveScale('font-size', 24, 16)}
`;
```

### Basic Usage

#### Modern @use Syntax (Recommended)

```scss
// In your main SCSS file
@use "responsive-scale-mixins" as rsm;

// Include variables in your root element (required)
:root {
  @include rsm.responsive-scale-variables();
}

// Use the mixin anywhere
.my-element {
  @include rsm.responsive-scale(font-size, 24, 16);
  @include rsm.responsive-scale(padding, 20 40, 10 20);
}
```

#### Legacy @import Syntax (for older setups)

```scss
// In your main SCSS file
@import "~responsive-scale-mixins";

// Include variables in your root element (required)
:root {
  @include responsive-scale-variables();
}

// Use the mixin anywhere
.my-element {
  @include responsive-scale(font-size, 24, 16);
  @include responsive-scale(padding, 20 40, 10 20);
}
```

## 📖 API Reference

### `responsive-scale-variables($desktop-width, $tablet-width, $mobile-width)`

Defines the CSS custom properties for scaling calculations.

**Parameters:**

- `$desktop-width`: Design width for desktop (default: 1920px)
- `$tablet-width`: Design width for tablet (default: 768px)
- `$mobile-width`: Design width for mobile (default: 390px)

### `responsive-scale($property, $desktop-value, $mobile-value, $unit, $is-percentage, $desktop-relative, $mobile-relative, $important)`

The main responsive scaling mixin.

**Parameters:**

- `$property`: CSS property name (e.g., `font-size`, `padding`)
- `$desktop-value`: Value for desktop screens
- `$mobile-value`: Value for mobile screens
- `$unit`: Unit for scaling (`px` or `rem`, default: `px`)
- `$is-percentage`: Whether the value is a percentage (default: `false`)
- `$desktop-relative`: Base value for percentage calculations on desktop
- `$mobile-relative`: Base value for percentage calculations on mobile
- `$important`: String to append (e.g., `" !important"` for override, default: `null`)

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

### Override Specificity

```scss
.override-bootstrap {
  @include rsm.responsive-scale(
    font-size,
    24,
    16,
    px,
    false,
    null,
    null,
    " !important"
  );
  @include rsm.responsive-scale(
    padding,
    16 32,
    8 16,
    px,
    false,
    null,
    null,
    " !important"
  );
}
```

## 🔧 Configuration

### Custom Design Widths

Easily customize the design widths to match your project's breakpoints:

```scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)

  // Custom design widths (desktop, tablet, mobile)
  @include rsm.responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include rsm.responsive-scale-variables();
}
```

**Default values:**

- Desktop: 1920px
- Tablet: 768px
- Mobile: 390px

### REM and EM Units

```scss
.element {
  @include rsm.responsive-scale(
    font-size,
    3,
    2,
    rem
  ); // 3rem / 2rem - uses rem scale factor
  @include rsm.responsive-scale(
    font-size,
    2,
    1.5,
    em
  ); // 2em / 1.5em - uses rem scale factor
}
```

**Universal Unit Support:**

The mixin supports **all CSS units** with a single generic scale factor:

**Absolute Units:**

- `@include responsive-scale(property, value, mobile-value, px)` → `* valuepx`
- `@include responsive-scale(property, value, mobile-value, pt)` → `* valuept`
- `@include responsive-scale(property, value, mobile-value, cm)` → `* valuecm`
- `@include responsive-scale(property, value, mobile-value, mm)` → `* valuemm`
- `@include responsive-scale(property, value, mobile-value, in)` → `* valuein`
- `@include responsive-scale(property, value, mobile-value, pc)` → `* valuepc`

**Relative Units:**

- `@include responsive-scale(property, value, mobile-value, em)` → `* valueem`
- `@include responsive-scale(property, value, mobile-value, rem)` → `* valuerem`
- `@include responsive-scale(property, value, mobile-value, %)` → `* value%`
- `@include responsive-scale(property, value, mobile-value, vw)` → `* valuevw`
- `@include responsive-scale(property, value, mobile-value, vh)` → `* valuevh`
- `@include responsive-scale(property, value, mobile-value, vmin)` → `* valuevmin`
- `@include responsive-scale(property, value, mobile-value, vmax)` → `* valuevmax`

**Example Usage:**

```scss
.element {
  @include rsm.responsive-scale(margin, 2, 1, cm); // centimeters
  @include rsm.responsive-scale(width, 50, 30, vw); // viewport width
  @include rsm.responsive-scale(height, 80, 60, vh); // viewport height
  @include rsm.responsive-scale(font-size, 1.5, 1, em); // em units
}
```

### Manual CSS Variables (Alternative)

If you prefer manual control, you can set the CSS variables directly:

```scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440); // Your desktop width
  --computed-tablet-scale-factor: calc(100vw / 768); // Your tablet width
  --computed-mobile-scale-factor: calc(100vw / 375); // Your mobile width
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}
```

## 🔧 Troubleshooting

If the `@include responsive-scale-variables()` mixin doesn't work in your setup (e.g., due to SCSS compilation issues), use the manual CSS variables approach. Below are manual setups for each framework:

### Why the Manual Approach Works

The `@include responsive-scale-variables()` mixin may fail in certain SCSS compilation environments (like some Next.js setups) because the imported mixins aren't processed correctly. The manual CSS variables approach bypasses this by directly defining the required `--computed-scale-factor-*` variables in `:root`.

### Next.js (App Router) - Manual Setup

```scss
// app/globals.css or app/styles/globals.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440); // Your design desktop width
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component files
@use "responsive-scale-mixins" as rsm;
.my-element {
  @include rsm.responsive-scale(font-size, 24, 16);
}
```

### Next.js (Pages Router) - Manual Setup

```scss
// styles/globals.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component files
@import "responsive-scale-mixins";
```

### Create React App - Manual Setup

```scss
// src/index.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component files
@import "responsive-scale-mixins";
```

### Vue.js - Manual Setup

```scss
// src/assets/styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component styles
@import "responsive-scale-mixins";
```

### Angular - Manual Setup

```scss
// src/styles.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component styles
@import "responsive-scale-mixins";
```

### Vite + Vue/React - Manual Setup

```scss
// src/styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### Gatsby - Manual Setup

```scss
// src/styles/global.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### Nuxt.js - Manual Setup

```scss
// assets/styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### SvelteKit - Manual Setup

```scss
// src/app.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### Astro - Manual Setup

```scss
// src/styles/global.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### CSS Modules - Manual Setup

```scss
// In your global CSS file (e.g., globals.scss)
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1920);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 390);
  --tablet-proportion-scale-factor: calc((100vw - 390px) / (1920px - 390px));
}

// In your module files
@use "responsive-scale-mixins" as rsm;
.myClass {
  @include rsm.responsive-scale(font-size, 24, 16);
}
```

### Tailwind CSS - Manual Setup

```scss
// styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@use "responsive-scale-mixins" as rsm;
.custom-element {
  @include rsm.responsive-scale(padding, 20 40, 10 20);
  @apply bg-blue-500 text-white;
}
```

### Styled Components - Manual Setup

```scss
// In your global styles
:root {
   // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In styled components with SCSS preprocessing
import styled from 'styled-components';
import './styles/responsive-mixins.scss';

const StyledComponent = styled.div`
  ${props => props.theme.responsiveScale('font-size', 24, 16)}
`;
```

**Note:** Replace `1440`, `768`, `375` with your actual design widths. The manual approach ensures compatibility across all build tools and frameworks.

## 📱 Breakpoints

- **Desktop**: ≥992px (scales from desktop design width)
- **Tablet**: 768px - 991px (interpolated values)
- **Mobile**: ≤767px (scales from mobile design width)

## 🛠 Development

### Building

```bash
npm install
# No build step required - pure SCSS
```

### Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Figma's responsive design principles
- Built for modern web development workflows
- Compatible with CSS Modules, Styled Components, and traditional CSS

## 🧪 Testing

The library includes a comprehensive test suite located in the `test/` directory:

```bash
# Run the test suite (cross-platform)
cd test && ./test.sh
```

If `./test.sh` fails because `sass` is not installed globally, run this instead from the repository root:

```bash
npx --yes sass test/test.scss test/test.css
start test/test.html
```

On Windows, you can also open `test/test.html` manually after compiling.

See [`test/TEST_README.md`](test/TEST_README.md) for detailed testing instructions.

<!-- ## � Linking NPM Package to GitHub Packages

To connect your published NPM package to GitHub Packages:

1. **Go to your GitHub repository** → **Settings** → **Packages**
2. **Click "Connect repository"** or **"Link to repository"**
3. **Search for and select** your NPM package: `responsive-scale-mixins`
4. **Confirm the connection**

This will display your NPM package statistics and information in the GitHub Packages section of your repository.

**Note:** The package will automatically appear in GitHub Packages once published to NPM, as long as the repository URL in `package.json` matches your GitHub repository. -->

## �📞 Support

- 📧 Email: saheedodulaja@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Sidodus/responsive-scale-mixins/issues)
- 📖 Docs: [Full Documentation](https://github.com/Sidodus/responsive-scale-mixins#readme)
- 📦 NPM: [https://www.npmjs.com/package/responsive-scale-mixins](https://www.npmjs.com/package/responsive-scale-mixins)
- 👤 NPM Profile: [https://www.npmjs.com/~sidodus](https://www.npmjs.com/~sidodus)

---

**Made with ❤️ by [Saheed Odulaja](https://github.com/Sidodus)**
