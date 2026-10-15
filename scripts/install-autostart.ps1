$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$vbsPath = Join-Path $projectDir "scripts\start-server.vbs"
$startupDir = [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs\Startup')
$shortcutPath = Join-Path $startupDir "AudioDrop-Server.lnk"

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$vbsPath`""
$shortcut.WorkingDirectory = $projectDir
$shortcut.Save()

Write-Host "AudioDrop Server successfully added to Windows Startup!" -ForegroundColor Green
Write-Host "Shortcut created at: $shortcutPath"
