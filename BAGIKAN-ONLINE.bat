@echo off
title AudioDrop - Akses Online (Cloudflare Tunnel)
echo ========================================================
echo   MEMBUKA AKSES ONLINE (CLOUDFLARE TUNNEL)
echo ========================================================
echo.
echo Pastikan server AudioDrop sedang AKTIF sebelum membuka tunnel.
echo Tunggu beberapa detik...
echo.
echo Cari link berakhiran ".trycloudflare.com" di bawah ini.
echo Link tersebut adalah alamat server publik kamu!
echo.
echo (Tekan CTRL + C jika ingin menutup akses online)
echo ========================================================
echo.
"%~dp0server\bin\cloudflared.exe" tunnel --url http://localhost:3000
pause
