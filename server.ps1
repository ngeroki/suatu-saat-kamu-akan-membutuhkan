<#
.SYNOPSIS
  SUATU SAAT v2 — Server Control Script (PowerShell)
#>

param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "status", "logs", "help")]
    [string]$Action = "status",

    [int]$Port = 4173
)

$WorkDir = $PSScriptRoot
$LogFile = Join-Path $WorkDir "server.log"
$PidFile = Join-Path $WorkDir "server.pid"
$ServerScript = Join-Path $WorkDir "scripts\server.js"

function Get-ServerListeningPID {
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        if ($conn) { return $conn.OwningProcess }
    } catch {}

    if (Test-Path $PidFile) {
        $savedPid = (Get-Content $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
        if ($savedPid) {
            $savedPid = $savedPid.Trim()
            $proc = Get-Process -Id $savedPid -ErrorAction SilentlyContinue
            if ($proc) { return $savedPid }
        }
    }
    return $null
}

function Show-Status {
    $listeningPid = Get-ServerListeningPID
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  SUATU SAAT v2 -- Server Status" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    if ($listeningPid) {
        Write-Host "  Status : ONLINE [RUNNING]" -ForegroundColor Green
        Write-Host "  URL    : http://localhost:$Port" -ForegroundColor Green
        Write-Host "  Port   : $Port" -ForegroundColor Yellow
        Write-Host "  PID    : $listeningPid" -ForegroundColor Yellow
    } else {
        Write-Host "  Status : OFFLINE [STOPPED]" -ForegroundColor Red
        Write-Host "  Port   : $Port (Free)" -ForegroundColor Gray
    }
    Write-Host "========================================================" -ForegroundColor Cyan
}

function Stop-ServerProcess {
    $listeningPid = Get-ServerListeningPID
    if ($listeningPid) {
        Write-Host "INFO: Stopping server (PID: $listeningPid)..." -ForegroundColor Yellow
        Stop-Process -Id $listeningPid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        Write-Host "SUCCESS: Server stopped." -ForegroundColor Green
    } else {
        Write-Host "INFO: No running server found on port $Port." -ForegroundColor Gray
    }
    if (Test-Path $PidFile) { Remove-Item $PidFile -Force -ErrorAction SilentlyContinue }
}

function Start-ServerProcess {
    $listeningPid = Get-ServerListeningPID
    if ($listeningPid) {
        Write-Host "WARNING: Server is already running on port $Port (PID: $listeningPid)." -ForegroundColor Yellow
        Show-Status
        return
    }

    Write-Host "INFO: Building production bundle..." -ForegroundColor Cyan
    Set-Location $WorkDir
    $buildResult = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run build" -NoNewWindow -Wait -PassThru
    if ($buildResult.ExitCode -ne 0) {
        Write-Host "ERROR: Build failed! Aborting server start." -ForegroundColor Red
        return
    }

    Write-Host "INFO: Starting detached server on http://localhost:$Port ..." -ForegroundColor Cyan
    
    # Detached creation via WMI Win32_Process
    $cmdLine = "cmd.exe /c node `"$ServerScript`" > `"$LogFile`" 2>&1"
    $wmi = [wmiclass]"win32_process"
    $result = $wmi.Create($cmdLine, $WorkDir, $null)

    if ($result.ReturnValue -eq 0) {
        $newPid = $result.ProcessId
        $newPid | Out-File $PidFile -Encoding utf8
        Start-Sleep -Seconds 2

        Write-Host "SUCCESS: Server is ONLINE!" -ForegroundColor Green
        Write-Host "SUCCESS: Local URL: http://localhost:$Port" -ForegroundColor Green
        Write-Host "SUCCESS: Process PID: $newPid" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to launch process (Error Code: $($result.ReturnValue))." -ForegroundColor Red
    }
}

function Show-Logs {
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  SUATU SAAT v2 -- Server Logs ($LogFile)" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    if (Test-Path $LogFile) {
        Get-Content $LogFile -Tail 30
    } else {
        Write-Host "INFO: No log file found yet." -ForegroundColor Gray
    }
    Write-Host "========================================================" -ForegroundColor Cyan
}

switch ($Action.ToLower()) {
    "start"   { Start-ServerProcess }
    "stop"    { Stop-ServerProcess }
    "restart" { Stop-ServerProcess; Start-ServerProcess }
    "status"  { Show-Status }
    "logs"    { Show-Logs }
    "help"    {
        Write-Host "Usage: .\server.bat [start | stop | restart | status | logs]"
    }
}