#!/bin/bash
set -e

# Find the JAR file in target directory
JAR_FILE=$(find target -name "*.jar" -type f | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "Error: No JAR file found in target directory"
    ls -la target/ || echo "Target directory does not exist"
    exit 1
fi

echo "Starting application with JAR: $JAR_FILE"
java -jar "$JAR_FILE"

