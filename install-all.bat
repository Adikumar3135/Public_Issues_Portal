@echo off
setlocal
cd /d "%~dp0server"
echo Installing backend dependencies...
call npm install
if errorlevel 1 goto failed
cd /d "%~dp0client"
echo Installing frontend dependencies...
call npm install
if errorlevel 1 goto failed
echo.
echo Setup complete. Copy server\.env.example to server\.env and client\.env.example to client\.env.
pause
exit /b 0
:failed
echo Installation failed. Check the error above.
pause
exit /b 1
