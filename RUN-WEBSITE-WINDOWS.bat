@echo off
setlocal
title AP CSP Study Website
cd /d "%~dp0"

echo ======================================
echo AP CSP Study Website Launcher
echo ======================================
echo.
echo Current folder:
echo %CD%
echo.

if not exist package.json (
  echo ERROR: package.json was not found in this folder.
  echo Make sure this file is inside the ap-csp-study folder.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not available.
  echo Install Node.js LTS from https://nodejs.org, then try again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not installed or not available.
  echo Reinstall Node.js LTS from https://nodejs.org, then try again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing project files. This may take a few minutes...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Copy the red error text and send it to ChatGPT.
    pause
    exit /b 1
  )
) else (
  echo node_modules already exists, skipping npm install.
)

echo.
echo Starting website...
echo When you see Local: http://localhost:5173, open that link in Chrome.
echo Keep this window open while using the website.
echo.
call npm run dev
pause
