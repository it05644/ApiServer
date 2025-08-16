@echo off
set PORT=3001
set URL=http://localhost:%PORT%/api-docs/

echo URL: %URL%

pause

REM check if port is in use
netstat -ano | findstr :%PORT% >nul
if %errorlevel% equ 0 (
    echo Port %PORT% is already in use.
    echo Please close the application using this port or change the PORT variable in this script.
    echo Exiting...
) else (
echo Starting server ...    
cd C:\users\ioant\.nodejs\apiserver
:: Start the server using PM2
pm2 start server.js --name my-server
pm2 save
pm2 list
::start "" node server.js
echo Starting Node.js server on port %PORT%...  
timeout /t 3 >nul
start msedge %URL%
)

pause

