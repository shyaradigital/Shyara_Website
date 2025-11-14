param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
    param(
        [string]$Message,
        [scriptblock]$Action
    )

    Write-Host "→ $Message" -ForegroundColor Cyan
    & $Action
}

function Ensure-Dependencies {
    param(
        [string]$Directory
    )

    if ($SkipInstall) {
        return
    }

    if (-not (Test-Path (Join-Path $Directory "node_modules"))) {
        Invoke-Step "Installing dependencies in $Directory" {
            Push-Location $Directory
            npm install
            Pop-Location
        }
    }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Invoke-Step "Preparing frontend build" {
    $frontend = Join-Path $root "frontend"
    Ensure-Dependencies $frontend
    Push-Location $frontend
    npm run build
    Pop-Location
}

Invoke-Step "Starting backend server" {
    $backend = Join-Path $root "backend"
    Ensure-Dependencies $backend
    Push-Location $backend
    npm start
}

