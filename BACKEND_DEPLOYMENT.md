# Backend Deployment Guide

## Option 1: Deploy to Vercel (Recommended for simplicity)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy Backend
```bash
cd backend
vercel --prod
```

### 3. Get the deployment URL
After deployment, Vercel will give you a URL like: `https://your-project-name.vercel.app`

### 4. Update Frontend Environment
Update your `.env` file:
```env
VITE_API_URL=https://your-project-name.vercel.app/api
```

## Option 2: Deploy to Railway

### 1. Go to [Railway.app](https://railway.app)
### 2. Connect your GitHub repository
### 3. Railway will auto-detect NestJS and deploy
### 4. Get the deployment URL from Railway dashboard

## Option 3: Deploy to Render

### 1. Go to [Render.com](https://render.com)
### 2. Create new Web Service
### 3. Connect GitHub repo
### 4. Set build command: `npm run build`
### 5. Set start command: `npm run start:prod`

## Environment Variables for Production

Create these environment variables in your deployment platform:

```env
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-vercel-url.vercel.app
JWT_SECRET=your-secure-jwt-secret-here
PORT=10000
```

## After Deployment

1. Update `VITE_API_URL` in your `.env` file with the backend URL
2. Commit and push the changes
3. Redeploy your frontend on Vercel
4. Test the connection

## Testing Deployment

Test your deployed backend:
```bash
curl https://your-backend-url.com/api/health
```

Should return: `{"status":"OK","timestamp":"..."}`