# Start Development Servers Script
# Starts backend (3001) and frontend (3000) with clear logs

Write-Host "[Dev] Starting Shyara servers..." -ForegroundColor Cyan
Write-Host ""

# Ensure backend/.env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "[Error] backend/.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend/.env with: GOOGLE_DRIVE_API_KEY=your_key" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Found backend/.env file" -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "[Dev] Starting Backend Server (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start frontend server
Write-Host "[Dev] Starting Frontend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "[OK] Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "[Info] Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "[Info] Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to exit this launcher (servers stay open in separate windows)..." -ForegroundColor Gray
Read-Host
