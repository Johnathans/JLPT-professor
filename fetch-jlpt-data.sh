#!/bin/bash

# Install ts-node if not already installed
npm install --save-dev ts-node

# Create the data directory if it doesn't exist
mkdir -p src/data

# Run the update script
echo "Running JLPT data update script..."
npx ts-node src/scripts/update-jlpt-data.ts

echo "Done!"
