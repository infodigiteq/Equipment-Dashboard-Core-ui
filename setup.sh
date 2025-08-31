#!/bin/bash

echo "🚀 Setting up Equipment Overview - Core UI"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Environment configuration
echo ""
echo "🔧 Environment Configuration"
echo "=========================="

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    if [ -f env.template ]; then
        cp env.template .env
        echo "✅ .env file created from env.template"
        echo ""
        echo "⚠️  IMPORTANT: You need to configure your .env file!"
        echo "   - For development with hardcoded data: Set VITE_USE_HARDCODED_DATA=true"
        echo "   - For Supabase integration: Get credentials from project lead"
        echo ""
        echo "🔑 Current .env settings:"
        echo "   VITE_USE_HARDCODED_DATA=true (using hardcoded data)"
        echo "   VITE_SUPABASE_ENABLED=false (Supabase disabled)"
    else
        echo "❌ env.template not found. Creating basic .env file..."
        cat > .env << EOF
# Basic environment configuration
VITE_USE_HARDCODED_DATA=true
VITE_SUPABASE_ENABLED=false
VITE_DEV_SERVER_PORT=3000
EOF
        echo "✅ Basic .env file created"
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎯 Setup complete! To start development:"
echo "   npm run dev"
echo ""
echo "📚 For more information, check README.md"
echo "🔄 To get latest updates: git pull origin main"
echo ""
echo "🔧 Environment Configuration:"
echo "   - Check your .env file for configuration"
echo "   - For hardcoded data mode: VITE_USE_HARDCODED_DATA=true"
echo "   - For Supabase mode: Contact project lead for credentials"
echo ""
echo "💡 Pro tip: You can run this setup script anytime with: ./setup.sh"
