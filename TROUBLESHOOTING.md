# Troubleshooting Guide

## Common Issues and Solutions

### 404 Error After Deployment

If you're getting a 404 error after deploying to Vercel, follow these steps:

#### 1. Check Your Deployment URL
- Make sure you're accessing the correct URL
- The URL should be something like: `https://your-project-name.vercel.app`
- Check your Vercel dashboard for the correct URL

#### 2. Verify Environment Variables
- Go to your Vercel project dashboard
- Navigate to Settings → Environment Variables
- Ensure `GEMINI_API_KEY` is set correctly
- Redeploy after adding environment variables

#### 3. Test API Routes
Try accessing these endpoints to verify deployment:
- Health check: `https://your-project-name.vercel.app/api/health`
- Should return: `{"status":"ok","message":"Kaizen Question Bank Solver API is running"}`

#### 4. Check Function Logs
- Go to your Vercel dashboard
- Navigate to Functions tab
- Check for any error logs
- Look for Puppeteer or API-related errors

#### 5. Common Causes of 404 Errors

**Missing Environment Variables**
```bash
# Check if GEMINI_API_KEY is set
echo $GEMINI_API_KEY
```

**Incorrect Base Path**
- Ensure your app is deployed to the root path `/`
- Check `vercel.json` configuration

**Build Issues**
- Verify build completes successfully
- Check for TypeScript errors
- Ensure all dependencies are installed

### Environment Variable Issues

#### GEMINI_API_KEY Not Set
**Symptoms:**
- AI processing fails
- "Failed to generate solution" errors
- API calls return 500 errors

**Solution:**
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to Vercel environment variables:
   ```
   Name: GEMINI_API_KEY
   Value: your_actual_api_key
   Environment: Production, Preview, Development
   ```
3. Redeploy the application

### PDF Generation Issues

#### Puppeteer Timeout
**Symptoms:**
- PDF generation takes too long
- Function timeout errors
- 500 errors on PDF download

**Solution:**
- Function timeout is set to 30 seconds in `vercel.json`
- Consider optimizing PDF content
- Check function logs for specific errors

#### Puppeteer Not Working
**Symptoms:**
- PDF generation fails
- Browser launch errors

**Solution:**
- Puppeteer is configured for serverless deployment
- Check Vercel function logs
- Ensure proper Chrome flags are set

### Performance Issues

#### Slow Loading
**Solutions:**
- Enable Vercel Analytics
- Check bundle size optimization
- Consider code splitting
- Optimize images and assets

#### Memory Issues
**Solutions:**
- Monitor function memory usage
- Optimize PDF generation
- Consider reducing bundle size

### Debugging Steps

#### 1. Local Testing
```bash
# Test locally with production build
npm run build
npm run start
```

#### 2. Check Vercel Logs
- Go to Vercel dashboard
- Navigate to Functions tab
- Check real-time logs
- Look for error messages

#### 3. Test API Endpoints
```bash
# Test health endpoint
curl https://your-project-name.vercel.app/api/health

# Test PDF generation (if needed)
curl -X POST https://your-project-name.vercel.app/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>Test</h1>","filename":"test.pdf"}'
```

#### 4. Environment Variable Testing
```bash
# Check if environment variables are loaded
curl https://your-project-name.vercel.app/api/health
```

### Redeployment Steps

If you need to redeploy:

1. **Push Changes**
   ```bash
   git add .
   git commit -m "Fix deployment issues"
   git push origin main
   ```

2. **Redeploy on Vercel**
   - Go to Vercel dashboard
   - Click "Redeploy" on your project
   - Or trigger a new deployment via Git push

3. **Verify Deployment**
   - Check build logs
   - Test the application
   - Verify all features work

### Getting Help

If you're still experiencing issues:

1. **Check Vercel Documentation**
   - [Vercel Troubleshooting](https://vercel.com/docs/troubleshooting)
   - [Next.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/nodejs)

2. **Create an Issue**
   - Include error logs
   - Describe the steps to reproduce
   - Include your Vercel project URL

3. **Contact Support**
   - Vercel support for deployment issues
   - Repository issues for code problems

---

**Last Updated**: $(date)
**Status**: Active troubleshooting guide
