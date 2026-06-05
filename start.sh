#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js..." >> /tmp/server-lifecycle.log
  npx next start -p 3000 -H 0.0.0.0 2>&1 >> /tmp/server-lifecycle.log
  echo "[$(date)] Server died, restarting in 1s..." >> /tmp/server-lifecycle.log
  sleep 1
done
