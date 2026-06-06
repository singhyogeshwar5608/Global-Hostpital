#!/bin/bash
cd /home/z/my-project
cp -r .next/static .next/standalone/.next/ 2>/dev/null
cp -r public .next/standalone/ 2>/dev/null
cd .next/standalone
node server.js
