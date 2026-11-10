@echo off
setlocal
if not exist "%~dp0server\.env" (
  echo Missing server\.env. Copy server\.env.example to server\.env and configure it first.
  pause
  exit /b 1
)
start "Public Issue Portal API" cmd /k "cd /d ""%~dp0server"" && npm run dev"
start "Public Issue Portal Client" cmd /k "cd /d ""%~dp0client"" && npm run dev"
