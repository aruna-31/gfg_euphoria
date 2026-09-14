@echo off
set /p msg="Enter commit message (or press enter for default): "
if "%msg%"=="" set msg="update: hackodessey changes"

git add -A
git commit -m "%msg%"
git push origin main

echo.
echo ========================================================
echo   Changes successfully committed and pushed to GitHub!
echo ========================================================
pause
