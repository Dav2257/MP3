$startupDir = [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs\Startup')
$shortcutPath = Join-Path $startupDir "AudioDrop-Server.lnk"

if (Test-Path $shortcutPath) {
    Remove-Item -Force $shortcutPath
    Write-Host "Auto-start AudioDrop Server BERHASIL dinonaktifkan." -ForegroundColor Yellow
} else {
    Write-Host "Auto-start memang belum aktif." -ForegroundColor Cyan
}
