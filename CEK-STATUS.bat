@echo off
title Status Server AudioDrop
echo ========================================================
echo   STATUS SERVER AUDIODROP
echo ========================================================
echo.
powershell.exe -Command "try { $res = Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -TimeoutSec 2; Write-Host 'STATUS: AKTIF / RUNNING' -ForegroundColor Green; Write-Host ('Port: 3000 | ytdlp: ' + $res.ytdlp + ' | Status: ' + $res.status) } catch { Write-Host 'STATUS: MATI / TIDAK BERJALAN' -ForegroundColor Red; Write-Host 'Jalankan JALANKAN-SERVER.bat untuk menghidupkannya.' -ForegroundColor Yellow }"
echo.
pause
