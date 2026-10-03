@echo off
title BuildAI Hub Launcher
echo ========================================================
echo          Starting BuildAI Hub Full-Stack Server
echo ========================================================
echo.
echo 1. Backend API: http://localhost:5000
echo 2. Web App:     http://localhost:3000
echo.
echo Admin Login:  admin@buildaihub.io / admin1234
echo Demo User:    user@buildaihub.io / user1234
echo ========================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

start http://localhost:3000

npm run start
pause
