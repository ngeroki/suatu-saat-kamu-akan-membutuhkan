@echo off
title SUATU SAAT v2 -- Stop Server
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" stop
echo.
echo Press any key to close this window...
pause >nul