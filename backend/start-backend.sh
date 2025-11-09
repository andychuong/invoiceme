#!/bin/bash

# InvoiceMe Backend Startup Script
# This script sets the correct Java version and starts the backend

echo "🚀 Starting InvoiceMe Backend..."
echo ""

# Set Java 17 (required for the project)
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"

# Verify Java version
echo "✅ Using Java version:"
java -version
echo ""

# Start the backend with local profile
echo "🔧 Starting Spring Boot application with local profile..."
echo "📊 Database: localhost:5432/invoiceme"
echo "👤 Database User: andychuong"
echo ""

mvn spring-boot:run -Dspring-boot.run.profiles=local

