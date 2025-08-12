@echo off
REM === Windows Git Project Init & Push Script ===

set /p REPO_URL="Enter the GitHub remote repository URL (e.g. https://github.com/username/repo.git): "
if "%REPO_URL%"=="" (
    echo Remote URL is required. Exiting.
    exit /b 1
)

git remote -v | findstr /C:"%REPO_URL%" >nul
if %errorlevel%==0 (
    echo Remote already set to %REPO_URL%.
) else (
    git remote add origin %REPO_URL%
    echo Remote added: %REPO_URL%
)

git status
set /p CONT="Continue with add/commit/push? (y/n): "
if /i not "%CONT%"=="y" exit /b 0

git add .
set /p COMMIT_MSG="Enter commit message: "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Initial commit

git commit -m "%COMMIT_MSG%"
git branch -M main
git push -u origin main

echo Project pushed to %REPO_URL%
pause
