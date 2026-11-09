@echo off
title MISSION OS Launcher
echo ========================================================
echo          🚀 Starting Mission OS Servers...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching Backend API on port 5000...
start "Mission OS Backend" cmd /k "npm --prefix server run start"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend on port 5173...
start "Mission OS Frontend" cmd /k "npm --prefix client run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo  ✅ Mission OS is LIVE and accessible at:
echo     http://localhost:5173
echo ========================================================
echo.
start http://localhost:5173
exit

