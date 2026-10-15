@echo off
title AudioDrop Backend Server
echo ========================================================
echo   MENJALANKAN SERVER AUDIODROP
echo ========================================================
echo Server berjalan di http://localhost:3000
echo Jangan tutup jendela ini selama kamu menggunakan web.
echo.
cd /d "%~dp0"
node server/server.js
pause
