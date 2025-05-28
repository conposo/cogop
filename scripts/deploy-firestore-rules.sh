#!/bin/bash

# Deploy Firestore Security Rules
# This script deploys the updated Firestore security rules to Firebase

echo "🔥 Deploying Firestore Security Rules..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ You are not logged in to Firebase. Please login first:"
    echo "firebase login"
    exit 1
fi

# Check if firestore.rules file exists
if [ ! -f "firestore.rules" ]; then
    echo "❌ firestore.rules file not found in the current directory"
    exit 1
fi

echo "📋 Current Firestore rules content:"
echo "=================================="
cat firestore.rules
echo "=================================="
echo ""

# Ask for confirmation
read -p "🤔 Do you want to deploy these rules? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying Firestore rules..."
    
    # Deploy only Firestore rules
    firebase deploy --only firestore:rules
    
    if [ $? -eq 0 ]; then
        echo "✅ Firestore rules deployed successfully!"
        echo ""
        echo "📝 The new rules include:"
        echo "   - News articles: Read (published only), Write (admins only)"
        echo "   - Admin collection: Read/Write (admins only)"
        echo "   - Churches collection: Read/Write (super admins only)"
        echo "   - All other collections: Denied by default"
        echo ""
        echo "🔒 Churches management is now secured for super admins only!"
    else
        echo "❌ Failed to deploy Firestore rules"
        exit 1
    fi
else
    echo "❌ Deployment cancelled"
    exit 1
fi 