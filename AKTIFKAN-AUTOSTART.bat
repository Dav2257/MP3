@echo off
title Aktifkan Auto-Start AudioDrop Server
echo ========================================================
echo   MENGAKTIFKAN AUTO-START SERVER AUDIODROP
echo ========================================================
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0scripts\install-autostart.ps1"
echo.
echo Server kamu sekarang akan OTOMATIS hidup di background
echo setiap kali laptop kamu dinyalakan!
echo ========================================================
echo.
pause
