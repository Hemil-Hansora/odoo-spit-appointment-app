#!/bin/bash

echo "🚀 Setting up Email for OTP Verification"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: You need to add your Resend API key!"
    echo ""
    echo "Follow these steps:"
    echo "1. Go to https://resend.com/signup"
    echo "2. Sign up for a free account"
    echo "3. Get your API key from https://resend.com/api-keys"
    echo "4. Open .env.local and replace 're_your_resend_api_key_here' with your actual key"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if resend is installed
echo "🔍 Checking if Resend package is installed..."
if npm list resend > /dev/null 2>&1; then
    echo "✅ Resend package is already installed"
else
    echo "📦 Installing Resend package..."
    npm install resend
    echo "✅ Resend package installed"
fi

echo ""
echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Get your Resend API key from: https://resend.com/api-keys"
echo "2. Add it to .env.local:"
echo "   RESEND_API_KEY=\"re_your_actual_key\""
echo "3. (Optional) Set your custom email address:"
echo "   EMAIL_FROM=\"noreply@yourdomain.com\""
echo "4. Restart your dev server: npm run dev"
echo "5. Test by signing up at: http://localhost:3000/sign-up"
echo ""
echo "📖 See EMAIL_SETUP_GUIDE.md for detailed instructions"
echo ""
