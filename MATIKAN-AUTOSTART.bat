@echo off
title Matikan Auto-Start AudioDrop Server
echo ========================================================
echo   MENONAKTIFKAN AUTO-START SERVER AUDIODROP
echo ========================================================
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0scripts\uninstall-autostart.ps1"
echo.
echo ========================================================
echo.
pause
