@echo off
node -v >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Node.js is installed. Starting server...
    cd server
    call npm install
    call npm run serve
) ELSE (
    echo Node.js is not installed. Opening README...
    start README.md
)
