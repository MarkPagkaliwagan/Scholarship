# Scholarship DB Setup
# Run as Administrator

$ErrorActionPreference = "Stop"
$TUNNEL_HOSTNAME = "scholarship.test.igat.com.ph"
$LOCAL_PORT = "5433"
$CLOUDFLARED_URL = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi"
$INSTALLER = "$env:TEMP\cloudflared.msi"
$CLOUDFLARED = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

Write-Host "Scholarship DB Setup" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

# Check admin
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: Run as Administrator." -ForegroundColor Red
    pause
    exit 1
}

# Install cloudflared if not present
if (-not (Test-Path $CLOUDFLARED)) {
    Write-Host "`nDownloading cloudflared..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $CLOUDFLARED_URL -OutFile $INSTALLER -UseBasicParsing
    Write-Host "Installing cloudflared..." -ForegroundColor Yellow
    Start-Process msiexec.exe -ArgumentList "/i `"$INSTALLER`" /quiet /norestart" -Wait
    Remove-Item $INSTALLER -Force
    Write-Host "cloudflared installed." -ForegroundColor Green
} else {
    Write-Host "`ncloudflared already installed." -ForegroundColor Green
}

# Remove existing task if any
$TASK_NAME = "ScholarshipDB"
if (Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue) {
    Write-Host "Removing existing task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TASK_NAME -Confirm:$false
}

# Register as scheduled task (runs at login, background)
Write-Host "`nRegistering startup task..." -ForegroundColor Yellow
$action = New-ScheduledTaskAction `
    -Execute $CLOUDFLARED `
    -Argument "access tcp --hostname $TUNNEL_HOSTNAME --url localhost:$LOCAL_PORT"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 0) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $TASK_NAME -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Scholarship DB tunnel via Cloudflare" | Out-Null

# Start it now
Write-Host "Starting tunnel..." -ForegroundColor Yellow
Start-ScheduledTask -TaskName $TASK_NAME
Start-Sleep -Seconds 3

Write-Host "`nDone! Tunnel running on localhost:$LOCAL_PORT" -ForegroundColor Green

Write-Host "`n============================" -ForegroundColor Cyan
Write-Host " Drizzle Studio (Browser UI)" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host "  URL: https://scholarship-studio.igat.com.ph" -ForegroundColor Yellow
Write-Host "  No login required — open and go." -ForegroundColor White

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host " Direct DB Connection (Advanced)" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Host:     localhost" -ForegroundColor White
Write-Host "  Port:     $LOCAL_PORT" -ForegroundColor White
Write-Host "  User:     scholarship_admin" -ForegroundColor White
Write-Host "  Password: 7Z6C0cYto0IGULtf697idsg5cUUnT4sx" -ForegroundColor White
Write-Host "  Database: scholarship_db" -ForegroundColor White
Write-Host "`n  DATABASE_URL=postgresql://scholarship_admin:7Z6C0cYto0IGULtf697idsg5cUUnT4sx@localhost:$LOCAL_PORT/scholarship_db" -ForegroundColor Yellow

Write-Host "`nTunnel auto-starts on every login." -ForegroundColor Green
pause
