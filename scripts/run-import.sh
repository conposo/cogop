#!/bin/bash

# Bulgarian Churches Import Script Runner
# This script loads environment variables and runs the church import

set -e

echo "🚀 Starting Bulgarian Churches Import..."
echo "==============================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create a .env.local file with your Firebase configuration."
    echo ""
    echo "Required variables:"
    echo "  NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "  NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "  NEXT_PUBLIC_FIREBASE_APP_ID"
    echo ""
    exit 1
fi

# Check if COGOP-churches directory exists
if [ ! -d "COGOP-churches" ]; then
    echo "❌ Error: COGOP-churches directory not found!"
    echo "Please ensure the COGOP-churches directory exists in the project root."
    exit 1
fi

# Load environment variables and run the import
echo "📋 Loading environment variables from .env.local..."
export $(cat .env.local | grep -v '^#' | xargs)

echo "🔥 Connecting to Firebase project: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "📁 Processing churches from COGOP-churches directory..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/dotenv/package.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run the import script
node scripts/import-bulgarian-churches.js

echo ""
echo "🎉 Import process completed!"
echo "Check the output above for success/error details." 