# 🎨 Responsive Scale Mixins

A powerful SCSS mixin system for creating perfectly responsive designs that maintain Figma proportions across all screen sizes.

## 🚀 Quick Start

```scss
@import "./src/styles/mixins";

// Basic usage
.my-element {
  @include responsive-scale(font-size, 24, 16);
  @include responsive-scale(padding, 20 40, 10 20);
}
```

## 📋 Table of Contents

- [Setup](#setup)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Property Examples](#property-examples)
- [Percentage Properties](#percentage-properties)
- [Tips & Best Practices](#tips--best-practices)

## 🔧 Setup

### 1. Import the Mixins

Add this to your SCSS file:

```scss
@import "../styles/mixins"; // Adjust path as needed
```

### 2. CSS Variables (Already configured in `global.scss`)

The mixin uses these responsive scale factors:

- `--computed-scale-factor-px` (Desktop: 1913px)
- `--computed-tablet-scale-factor-px` (Tablet: 768px)
- `--computed-mobile-scale-factor-px` (Mobile: 390px)

## 🎯 Basic Usage

### Same Value for All Screens

When you want the same value across desktop, tablet, and mobile:

```scss
// Single parameter - same value for all breakpoints
.element {
  @include responsive-scale(border-radius, 10);
  @include responsive-scale(font-weight, 500);
}
```

**Output:**

```css
.element {
  border-radius: calc(var(--computed-scale-factor-px) * 10);
}

@media (min-width: 768px) and (max-width: 991px) {
  .element {
    border-radius: calc(var(--computed-tablet-scale-factor-px) * 10);
  }
}

@media (max-width: 767px) {
  .element {
    border-radius: calc(var(--computed-mobile-scale-factor-px) * 10);
  }
}
```

### Different Values for Desktop & Mobile

When desktop and mobile need different values:

```scss
// Two parameters - desktop and mobile values
.element {
  @include responsive-scale(font-size, 24, 16);
  @include responsive-scale(height, 60, 40);
}
```

**Output:**

```css
.element {
  font-size: calc(var(--computed-scale-factor-px) * 24);
  height: calc(var(--computed-scale-factor-px) * 60);
}

@media (min-width: 768px) and (max-width: 991px) {
  .element {
    font-size: calc(
      var(--computed-tablet-scale-factor-px) *
        (16 + var(--tablet-proportion-scale-factor) * (24 - 16))
    );
    height: calc(
      var(--computed-tablet-scale-factor-px) *
        (40 + var(--tablet-proportion-scale-factor) * (60 - 40))
    );
  }
}

@media (max-width: 767px) {
  .element {
    font-size: calc(var(--computed-mobile-scale-factor-px) * 16);
    height: calc(var(--computed-mobile-scale-factor-px) * 40);
  }
}
```

## ⚡ Advanced Usage

### REM Units

```scss
.element {
  @include responsive-scale(font-size, 2, 1.5, rem);
}
```

### Multi-Value Properties

```scss
.element {
  @include responsive-scale(padding, 20 40 20 40, 10 20 10 20);
  @include responsive-scale(margin, 0 10, 0 5);
}
```

## 📏 Property Examples

### Typography

```scss
.text {
  @include responsive-scale(font-size, 24, 16);
  @include responsive-scale(line-height, 1.5, 1.4);
  @include responsive-scale(letter-spacing, -0.5, -0.3);
}
```

### Spacing

```scss
.card {
  @include responsive-scale(padding, 20 30, 15 20);
  @include responsive-scale(margin, 0 0 20 0, 0 0 15 0);
}
```

### Dimensions

```scss
.button {
  @include responsive-scale(width, 200, 150);
  @include responsive-scale(height, 50, 40);
  @include responsive-scale(border-radius, 8, 6);
}
```

### Borders & Shadows

```scss
.box {
  @include responsive-scale(border-width, 2, 1);
  @include responsive-scale(border-radius, 10, 8);
}
```

## 📊 Percentage Properties

For properties that are percentages of other values:

```scss
.element {
  @include responsive-scale(
    letter-spacing,
    -1.5,
    // Desktop percentage
    -1.5,
    // Mobile percentage
    px,
    true,
    // Is percentage-based
    24,
    // Desktop base value (font-size)
    16 // Mobile base value (font-size)
  );
}
```

**Output:**

```css
.element {
  letter-spacing: calc(-1.5 / 100 * (var(--computed-scale-factor-px) * 24));
}

@media (min-width: 768px) and (max-width: 991px) {
  .element {
    letter-spacing: calc(
      -1.5 / 100 *
        (
          var(--computed-tablet-scale-factor-px) *
            (16 + var(--tablet-proportion-scale-factor) * (24 - 16))
        )
    );
  }
}

@media (max-width: 767px) {
  .element {
    letter-spacing: calc(
      -1.5 / 100 * (var(--computed-mobile-scale-factor-px) * 16)
    );
  }
}
```

## 💡 Tips & Best Practices

### ✅ Do's

- Use consistent units (px for most cases, rem for typography)
- Test on multiple screen sizes
- Use the same base values from your Figma design
- Combine with your existing CSS variables

### ❌ Don'ts

- Don't mix units in the same property
- Don't use negative values for dimensions
- Don't forget to import the mixins

### 🎨 Visual Guide

```
Desktop (≥992px) → Uses desktop scale factor
Tablet (768-991px) → Auto-interpolated values
Mobile (≤767px) → Uses mobile scale factor
```

### 🔧 Customization

Adjust scale factors in `global.scss`:

```scss
--scale-factor: calc(100vw / 1920); // Change desktop width
--mobile-scale-factor: calc(100vw / 375); // Change mobile width
```

## 📚 Complete Example

```scss
@import "../styles/mixins";

.hero-button {
  @include responsive-scale(font-size, 20, 16);
  @include responsive-scale(padding, 15 30, 12 24);
  @include responsive-scale(border-radius, 8, 6);
  @include responsive-scale(height, 50, 44);

  // Percentage-based
  @include responsive-scale(letter-spacing, -1, -1, px, true, 20, 16);
}
```

This creates a perfectly responsive button that scales beautifully across all devices! 🎉
