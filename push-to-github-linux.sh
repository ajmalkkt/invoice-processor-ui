#!/bin/bash
# === Linux/Mac Git Project Init & Push Script ===
read -p "Enter the GitHub remote repository URL (e.g. https://github.com/username/repo.git): " REPO_URL
if [ -z "$REPO_URL" ]; then
  echo "Remote URL is required. Exiting."
  exit 1
fi

git remote -v | grep "$REPO_URL" >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Remote already set to $REPO_URL."
else
  git remote add origin "$REPO_URL"
  echo "Remote added: $REPO_URL"
fi

git status
read -p "Continue with add/commit/push? (y/n): " CONT
if [ "$CONT" != "y" ]; then
  exit 0
fi

git add .
read -p "Enter commit message: " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="Initial commit"
fi

git commit -m "$COMMIT_MSG"
git branch -M main
git push -u origin main

echo "Project pushed to $REPO_URL"
