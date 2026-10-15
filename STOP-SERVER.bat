@echo off
title Hentikan Server AudioDrop
echo ========================================================
echo   MENGHENTIKAN SERVER AUDIODROP (PORT 3000)
echo ========================================================
echo.
set FOUND=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /f /pid %%a >nul 2>&1
    set FOUND=1
)
if "%FOUND%"=="1" (
    echo [SUKSES] Server AudioDrop di port 3000 berhasil dihentikan.
) else (
    echo [INFO] Server AudioDrop saat ini sedang tidak berjalan.
)
echo.
pause
