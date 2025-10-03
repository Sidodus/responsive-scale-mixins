@echo off
echo Compiling test.scss to test.css...
sass test.scss test.css
if %errorlevel% equ 0 (
    echo ✅ Compilation successful!
    echo.
    echo Opening test.html in default browser...
    start test.html
) else (
    echo ❌ Compilation failed!
    pause
)
