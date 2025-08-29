# TeamSync Server - Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **MongoDB Atlas**: Set up a MongoDB cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Google OAuth**: Configure OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
4. **GitHub Repository**: Your code should be pushed to a GitHub repository

## Pre-deployment Setup

### 1. MongoDB Atlas Configuration

1. Create a new MongoDB Atlas cluster
2. Create a database user with read/write access
3. Add Railway's IP addresses to the network access list (or use 0.0.0.0/0 for all IPs)
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/teamsync_db`

### 2. Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your Railway domain to authorized origins and redirect URIs:
   - Authorized JavaScript origins: `https://your-app-name.railway.app`
   - Authorized redirect URIs: `https://your-app-name.railway.app/api/auth/google/callback`

## Railway Deployment Steps

### 1. Connect Repository to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Choose the server directory if it's in a monorepo setup

### 2. Configure Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add:

```bash
NODE_ENV=production
BASE_PATH=/api

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/teamsync_db

# Session Configuration
SESSION_SECRET=your-super-secret-session-key
SESSION_EXPIRES_IN=1d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-app-name.railway.app/api/auth/google/callback

# Frontend URLs
FRONTEND_ORIGIN=https://teamsyncnow.vercel.app
FRONTEND_GOOGLE_CALLBACK_URL=https://teamsyncnow.vercel.app/google/callback
```

**Note**: Railway automatically provides the `PORT` environment variable, so you don't need to set it.

### 3. Configure Build Settings

Railway should automatically detect your Node.js app and use the build configuration from `railway.json`:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 4. Deploy

1. Click "Deploy" or push changes to your connected branch
2. Railway will automatically build and deploy your application
3. Once deployed, you'll get a URL like: `https://your-app-name.railway.app`

## Post-deployment Configuration

### 1. Update Google OAuth URLs

Update your Google OAuth configuration with your actual Railway URL:
- Replace `your-app-name.railway.app` with your actual Railway domain
- Update the `GOOGLE_CALLBACK_URL` environment variable in Railway

### 2. Update Frontend Configuration

Make sure your frontend is configured to use the Railway backend URL:
- Update CORS origins if needed
- Update API endpoints in your frontend application

### 3. Test the Deployment

1. Visit `https://your-app-name.railway.app/api` - should show welcome message
2. Visit `https://your-app-name.railway.app/api/docs` - should show Swagger documentation
3. Test authentication endpoints
4. Test database connectivity
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/google/callback`

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `server` (if in monorepo)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`

### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:
(Note: PORT is not needed as Vercel handles port assignment automatically)

```env
NODE_ENV=production
BASE_PATH=/api
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/teamsync?retryWrites=true&w=majority
SESSION_SECRET=your-super-secure-session-secret
SESSION_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-app-name.vercel.app/api/auth/google/callback
FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
FRONTEND_GOOGLE_CALLBACK_URL=https://your-frontend-domain.vercel.app/google/callback
```

### 4. Deploy

Click "Deploy" in the Vercel dashboard, or use CLI:

```bash
vercel --prod
```

## Post-deployment

### 1. Test API Endpoints

- Health check: `https://your-app-name.vercel.app/api/health`
- Swagger docs: `https://your-app-name.vercel.app/api-docs`

### 2. Update Frontend Configuration

Update your client's environment variables:

```env
VITE_API_BASE_URL=https://your-app-name.vercel.app/api
```

### 3. Database Seeding

After successful deployment, you may need to seed your database:

1. Use MongoDB Compass or Atlas UI to run seeding scripts
2. Or create a separate seeding endpoint (remember to secure it)

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all TypeScript dependencies are in `dependencies`, not `devDependencies`
2. **TypeScript Errors**: The build is configured to ignore type errors using `tsconfig.production.json`
3. **MongoDB Connection**: Verify connection string and network access
4. **Environment Variables**: Double-check all required variables are set
5. **CORS Issues**: Ensure `FRONTEND_ORIGIN` is correctly configured
6. **Port Configuration**: Don't set PORT env variable in Vercel (handled automatically)

### Logs and Debugging

- Check Vercel function logs in the dashboard
- Use `console.log` for debugging (visible in function logs)
- Monitor MongoDB Atlas logs for database connection issues

### Performance Considerations

- Vercel functions have a 10-second timeout limit
- Consider implementing database connection pooling
- Use MongoDB Atlas connection caching
- Optimize heavy operations for serverless environment

## Security Checklist

- [ ] Strong session secret (min 32 characters)
- [ ] MongoDB connection string with strong password
- [ ] Google OAuth credentials secured
- [ ] Environment variables properly configured
- [ ] CORS origins restricted to your frontend domain
- [ ] Rate limiting configured appropriately

## Monitoring and Maintenance

1. **Vercel Analytics**: Monitor function performance
2. **MongoDB Atlas Monitoring**: Track database performance
3. **Error Logging**: Implement proper error tracking
4. **Regular Updates**: Keep dependencies updated for security

## Scaling Considerations

- Vercel automatically scales serverless functions
- MongoDB Atlas auto-scaling for database
- Consider upgrading to Vercel Pro for higher limits
- Implement caching strategies for frequently accessed data
