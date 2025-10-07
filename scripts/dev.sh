#!/bin/bash

# Development script for Pi Server Setup Guide
# This script helps manage both documentation and frontend development

echo "🚀 Pi Server Setup Guide - Development Helper"
echo "=============================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "docs" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected structure: pi-server/ (with frontend/ and docs/ folders)"
    exit 1
fi

echo ""
echo "What would you like to do?"
echo "1) Start frontend development server"
echo "2) Build frontend for production"
echo "3) Open documentation in browser"
echo "4) View project structure"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🔧 Starting frontend development server..."
        cd frontend
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies..."
            npm install
        fi
        echo "🌐 Starting dev server at http://localhost:5173"
        npm run dev
        ;;
    2)
        echo "🏗️ Building frontend for production..."
        cd frontend
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies..."
            npm install
        fi
        npm run build
        echo "✅ Build complete! Output in frontend/dist/"
        ;;
    3)
        echo "📚 Opening documentation..."
        if command -v code &> /dev/null; then
            code docs/
        elif command -v open &> /dev/null; then
            open docs/
        else
            echo "📁 Documentation files are in the docs/ folder"
            ls -la docs/
        fi
        ;;
    4)
        echo "📁 Project Structure:"
        echo ""
        tree -I 'node_modules|dist|.git' -L 3 || ls -la
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please enter 1-5."
        exit 1
        ;;
esac
