@echo off
title SUATU SAAT v2 -- Server Status & Logs
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" status
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" logs
echo.
echo Press any key to close this window...
pause >nul