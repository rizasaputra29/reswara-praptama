#!/bin/bash

# Deployment script for production
echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Build the application
npm run build

# Restart the application (if using PM2)
pm2 restart ecosystem.config.js

echo "Deployment completed!"