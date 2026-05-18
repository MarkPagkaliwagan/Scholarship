# Scholarship DB - Connect (Windows)
# No admin needed. Double-click or run:
#   powershell -ExecutionPolicy Bypass -File scripts\connect.ps1

$TUNNEL_HOSTNAME = if ($env:TUNNEL_HOSTNAME) { $env:TUNNEL_HOSTNAME } else { "trial-db.igat.com.ph" }
$LOCAL_PORT      = "5433"
$CLOUDFLARED_EXE = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$DOWNLOAD_URL    = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"

Write-Host ""
Write-Host "  Scholarship DB - Tunnel Connect" -ForegroundColor Cyan
Write-Host "  ================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $CLOUDFLARED_EXE)) {
    Write-Host "  Downloading cloudflared.exe (first run only)..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $DOWNLOAD_URL -OutFile $CLOUDFLARED_EXE -UseBasicParsing
    Write-Host "  Done." -ForegroundColor Green
    Write-Host ""
}

Write-Host "  Tunnel: localhost:$LOCAL_PORT -> $TUNNEL_HOSTNAME" -ForegroundColor White
Write-Host ""
Write-Host "  DATABASE_URL:" -ForegroundColor Green
Write-Host "  postgresql://scholarship_admin:<password>@localhost:${LOCAL_PORT}/scholarship_db" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Keep this window open while working. Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

& $CLOUDFLARED_EXE access tcp --hostname $TUNNEL_HOSTNAME --url "localhost:$LOCAL_PORT"
