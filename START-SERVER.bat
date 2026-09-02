@echo off
title SUATU SAAT v2 -- Start Server
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" start
echo.
echo Opening http://localhost:4173 in browser...
start http://localhost:4173
echo.
echo Press any key to close this window...
pause >nul