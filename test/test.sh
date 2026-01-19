#!/bin/bash

echo "🎨 Responsive Scale Mixins v2.0.6 - Test Script"
echo "=============================================="
echo ""

echo "📝 Compiling test.scss to test.css..."
if sass test.scss test.css; then
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
else
    echo "❌ Compilation failed!"
    exit 1
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
