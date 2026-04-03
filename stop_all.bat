@echo off
echo Stopping the LendPool Platform...

:: Stop Algorand Localnet Gracefully
echo Stopping Algorand Localnet...
algokit localnet stop

:: Kill the CMD windows that were opened by start_all.bat
echo Closing Terminal Windows...
taskkill /F /FI "WINDOWTITLE eq FastAPI Backend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq React Frontend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Algorand LocalNet*" /T >nul 2>&1

echo All services have been stopped successfully!
