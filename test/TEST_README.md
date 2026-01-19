# 🧪 Responsive Scale Mixins - Test Suite

This directory contains comprehensive tests for the Responsive Scale Mixins library. These tests verify that the SCSS mixins work correctly across different units, breakpoints, and use cases.

## 📁 Test Files

### Core Test Files

- **`test.scss`** - Main test file using SCSS mixins
- **`test.css`** - Compiled CSS output (auto-generated)
- **`test.html`** - Visual test page for browser testing
- **`test.sh`** - Automated test script (cross-platform)

### Generated Files (Auto-created)

- **`test.css.map`** - Source map for debugging

## 🚀 Running Tests

### Quick Test (Recommended)

```bash
# Cross-platform (Unix/Linux/macOS/Windows)
cd test && ./test.sh
```

This will:

1. ✅ Compile `test.scss` to `test.css`
2. ✅ Open `test.html` in your default browser
3. ✅ Display testing instructions

### Manual Testing

```bash
# Compile SCSS
sass test.scss test.css

# Open test page
# - On Linux: xdg-open test.html
# - On macOS: open test.html
# - On Windows: start test.html
```

## 🧪 What Gets Tested

### 1. **Unit Support**

- ✅ **rem units**: `@include responsive-scale(font-size, 2, 1.5, rem)`
- ✅ **em units**: `@include responsive-scale(font-size, 1, 0.8, em)`
- ✅ **px units**: `@include responsive-scale(width, 200, 150, px)`
- ✅ **Percentage-based**: `@include responsive-scale(letter-spacing, -1, -0.5, px, true, 16, 14)`

### 2. **Responsive Breakpoints**

- ✅ **Desktop** (≥992px): Scales from 1440px design width
- ✅ **Tablet** (768px-991px): Interpolated values between desktop/mobile
- ✅ **Mobile** (≤767px): Scales from 375px design width

### 3. **CSS Variable Generation**

- ✅ Generic scale factors: `--computed-scale-factor`
- ✅ Unit appending: `* 2rem`, `* 1em`, `* 200px`
- ✅ Media query support for all breakpoints

### 4. **Visual Verification**

- ✅ Browser rendering at different viewport sizes
- ✅ DevTools computed values verification
- ✅ Responsive scaling behavior

## 📋 Test Checklist

### Compilation Tests

- [ ] `test.scss` compiles without errors
- [ ] No SCSS syntax errors
- [ ] All mixins resolve correctly
- [ ] CSS variables are generated properly

### Unit Tests

- [ ] **rem units**: Scale with root font-size
- [ ] **em units**: Scale with parent font-size
- [ ] **px units**: Absolute scaling
- [ ] **Percentage**: Correct relative calculations

### Breakpoint Tests

- [ ] **Desktop** (≥992px): Values match design specifications
- [ ] **Tablet** (768-991px): Smooth interpolation
- [ ] **Mobile** (≤767px): Mobile-optimized values

### Browser Tests

- [ ] Visual scaling at each breakpoint
- [ ] DevTools shows correct computed values
- [ ] No CSS errors in console
- [ ] Responsive behavior on window resize

## 🔍 Expected CSS Output

### Generated Variables

```css
:root {
  --computed-scale-factor: calc(100vw / 1440px);
  --computed-tablet-scale-factor: calc(100vw / 768px);
  --computed-mobile-scale-factor: calc(100vw / 375px);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}
```

### Generated Styles

```css
/* rem units */
font-size: calc(var(--computed-scale-factor) * 2rem);

/* em units */
font-size: calc(var(--computed-scale-factor) * 1em);

/* px units */
width: calc(var(--computed-scale-factor) * 200px);

/* Tablet breakpoint */
@media screen and (min-width: 768px) and (max-width: 991px) {
  font-size: calc(
    var(--computed-tablet-scale-factor) *
      (1.5rem + var(--tablet-proportion-scale-factor) * (2rem - 1.5rem))
  );
}

/* Mobile breakpoint */
@media screen and (max-width: 767px) {
  font-size: calc(var(--computed-mobile-scale-factor) * 1.5rem);
}
```

## 🐛 Troubleshooting

### Compilation Issues

```bash
# Check Sass version
sass --version

# Reinstall Sass if needed
npm install -g sass

# Clear any cached files
rm -f test.css test.css.map
```

### Browser Issues

- **Page not loading**: Check that `test.css` exists and is linked correctly
- **Styles not applying**: Verify CSS variables are defined in `:root`
- **Scaling not working**: Check viewport width in DevTools

### Test Script Issues

```bash
# Make script executable (Linux/macOS)
chmod +x test.sh

# On Windows: If test.bat fails, try using test.sh
chmod +x test.sh  # Make executable
./test.sh         # Run the shell script

# Check browser commands
which xdg-open  # Linux
which open      # macOS
which start     # Windows (in bash)
```

## 📊 Test Coverage

### Units Tested

- [x] px (pixels)
- [x] rem (root em)
- [x] em (element em)
- [x] % (percentage-based calculations)

### Breakpoints Tested

- [x] Desktop (≥992px)
- [x] Tablet (768px-991px)
- [x] Mobile (≤767px)

### Features Tested

- [x] Single value scaling
- [x] Multi-value scaling (padding, margin)
- [x] Percentage-based properties
- [x] Media query generation
- [x] CSS variable integration

## 🤝 Contributing to Tests

When adding new tests:

1. **Update `test.scss`** with new mixin calls
2. **Update `test.html`** with corresponding HTML elements
3. **Update this README** with new test cases
4. **Test across all breakpoints** and units
5. **Verify in multiple browsers**

### Test File Structure

```
test.scss      # SCSS mixin calls
├── Variables  # @include responsive-scale-variables()
├── Mixins     # @include responsive-scale() calls
└── Output     # Compiled to test.css

test.html      # Visual test page
├── Styles     # Links to test.css
├── Content    # HTML elements to test
└── Scripts    # Viewport width display
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Sidodus/responsive-scale-mixins/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Sidodus/responsive-scale-mixins/discussions)
- **Documentation**: [Main README](../README.md)

---

**Test Suite Version**: 2.0.7
**Last Updated**: January 2026
**Tested With**: Dart Sass 1.93.2
