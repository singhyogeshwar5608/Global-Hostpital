#!/bin/bash
# Keep-alive script for Next.js server
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js server..."
  npx next start -p 3000 -H 0.0.0.0 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2 seconds..."
  sleep 2
done
