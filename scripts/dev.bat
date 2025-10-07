@echo off
REM Development script for Pi Server Setup Guide
REM This script helps manage both documentation and frontend development

echo 🚀 Pi Server Setup Guide - Development Helper
echo ==============================================

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Expected structure: pi-server\ (with frontend\ and docs\ folders)
    pause
    exit /b 1
)

if not exist "docs" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Expected structure: pi-server\ (with frontend\ and docs\ folders)
    pause
    exit /b 1
)

echo.
echo What would you like to do?
echo 1) Start frontend development server
echo 2) Build frontend for production
echo 3) Open documentation folder
echo 4) View project structure
echo 5) Exit

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo 🔧 Starting frontend development server...
    cd frontend
    if not exist "node_modules" (
        echo 📦 Installing dependencies...
        npm install
    )
    echo 🌐 Starting dev server at http://localhost:5173
    npm run dev
) else if "%choice%"=="2" (
    echo 🏗️ Building frontend for production...
    cd frontend
    if not exist "node_modules" (
        echo 📦 Installing dependencies...
        npm install
    )
    npm run build
    echo ✅ Build complete! Output in frontend\dist\
) else if "%choice%"=="3" (
    echo 📚 Opening documentation folder...
    explorer docs
) else if "%choice%"=="4" (
    echo 📁 Project Structure:
    echo.
    dir /b
    echo.
    echo Frontend files:
    dir frontend /b
    echo.
    echo Documentation files:
    dir docs /b
) else if "%choice%"=="5" (
    echo 👋 Goodbye!
    exit /b 0
) else (
    echo ❌ Invalid choice. Please enter 1-5.
    pause
    exit /b 1
)

pause
