#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "🎨 Responsive Scale Mixins v2.1.0 - Test Script"
echo "=============================================="
echo ""

echo "📝 Compiling test.scss to test.css..."
if command -v sass > /dev/null; then
    sass test.scss test.css
elif command -v npx > /dev/null; then
    npx --yes sass test.scss test.css
else
    echo "❌ Compilation failed!"
    echo "   sass is not installed and npx is unavailable."
    echo "   Install Dart Sass globally or run: npx --yes sass test.scss test.css"
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "❌ test.scss compilation failed!"
    exit 1
fi

echo "📝 Compiling regression.scss to regression.css..."
if command -v sass > /dev/null; then
    sass regression.scss regression.css
elif command -v npx > /dev/null; then
    npx --yes sass regression.scss regression.css
else
    echo "❌ Compilation failed!"
    echo "   sass is not installed and npx is unavailable."
    echo "   Install Dart Sass globally or run: npx --yes sass regression.scss regression.css"
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "❌ regression.scss compilation failed!"
    exit 1
fi

echo "✅ Compilation successful!"
echo ""
echo "🌐 Opening test.html in default browser..."

# Try different browser commands
if command -v xdg-open > /dev/null; then
    xdg-open test.html
elif command -v open > /dev/null; then
    open test.html
elif command -v start > /dev/null; then
    start test.html
elif command -v cmd.exe > /dev/null; then
    cmd.exe /c start test.html
else
    echo "❓ Could not detect browser command."
    echo "   Please manually open test.html in your browser."
    echo ""
    echo "📋 Test Instructions:"
    echo "   1. Open test.html in your browser"
    echo "   2. Resize the browser window"
    echo "   3. Check DevTools → Computed tab"
    echo "   4. Verify rem/em/px units scale correctly"
fi

echo ""
echo "🎯 Test what to check:"
echo "   • Heading (rem): font-size should scale with viewport"
echo "   • Paragraph (em): font-size should scale relative to parent"
echo "   • Box (px): dimensions should scale proportionally"
echo "   • Letter spacing: should be percentage-based calculation"
echo ""
echo "📱 Resize browser to test breakpoints:"
echo "   • Desktop: ≥992px"
echo "   • Tablet: 768px-991px (interpolated)"
echo "   • Mobile: ≤767px"
