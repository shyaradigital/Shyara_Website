# Start Development Servers Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting Shyara Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ ERROR: backend/.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend/.env with: GOOGLE_DRIVE_API_KEY=your_key" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found backend/.env file" -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "📦 Starting Backend Server (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🎨 Starting Frontend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "📍 Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)..." -ForegroundColor Gray
Read-Host

