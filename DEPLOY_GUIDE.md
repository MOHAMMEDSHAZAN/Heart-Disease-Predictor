# Deployment Guide

## Deploy backend to Render (Docker)
1. Create a Render account and new Web Service -> Docker.
2. Connect GitHub repo and pick the repo.
3. Set Build Command: leave default. Start Command: leave empty for Docker.
4. Set environment variables (if any).
5. Add `model_files` to repo (or use Render's filesystem / blob storage).

## Deploy backend to Heroku
1. Install Heroku CLI and login.
2. Create app: `heroku create your-app-name`.
3. Add Heroku remote and push: `git push heroku main`.
4. Set config vars via `heroku config:set KEY=VALUE`.
Note: Add model files to repository or use an external storage endpoint and update app to download on startup.

## Deploy frontend to Vercel/Netlify
- Use the frontend folder as the project root. Set the build command to `npm run build` and the publish directory to `frontend/build` or `/` depending on platform. Set env var `REACT_APP_API_URL` to your backend url.
