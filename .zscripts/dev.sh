#!/bin/bash
cd /home/z/my-project
# Ensure static files are in place
cp -r .next/static .next/standalone/.next/ 2>/dev/null
cp -r public .next/standalone/ 2>/dev/null
# Start the standalone production server
cd .next/standalone
exec node server.js
