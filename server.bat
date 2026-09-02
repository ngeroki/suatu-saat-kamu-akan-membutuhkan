@echo off
title SUATU SAAT v2 -- Server Control Panel
setlocal enabledelayedexpansion

if not "%~1"=="" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" %*
    goto end
)

:menu
cls
echo ========================================================
echo   SUATU SAAT v2 -- Server Control Panel (Interactive)
echo ========================================================
echo.
echo   [1] Start Server  (Nyalakan ^& Buka Browser)
echo   [2] Cek Status    (Lihat Online / Offline)
echo   [3] Lihat Log     (Lihat Akses Realtime)
echo   [4] Restart       (Nyalakan Ulang)
echo   [5] Stop Server   (Matikan Server)
echo   [0] Keluar
echo.
echo ========================================================
set /p choice="Pilih menu [0-5]: "

if "%choice%"=="1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" start
    start http://localhost:4173
    pause
    goto menu
)
if "%choice%"=="2" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" status
    pause
    goto menu
)
if "%choice%"=="3" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" logs
    pause
    goto menu
)
if "%choice%"=="4" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" restart
    start http://localhost:4173
    pause
    goto menu
)
if "%choice%"=="5" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" stop
    pause
    goto menu
)
if "%choice%"=="0" goto end

goto menu

:end
endlocal