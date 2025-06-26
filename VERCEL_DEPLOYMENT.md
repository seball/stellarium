# Stellarium - Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/stellarium)

## Manual Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/in with your GitHub account
3. Click "New Project"
4. Import your Stellarium repository

### 3. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:

| Name | Value | Environment |
|------|-------|-------------|
| `GITHUB_TOKEN` | Your GitHub Personal Access Token | Production, Preview, Development |

#### Getting GitHub Token

1. Go to [GitHub Settings](https://github.com/settings/personal-access-tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: `repo` (Full control of private repositories)
4. Copy the token and paste it in Vercel

### 4. Deploy

Vercel will automatically:
- Install dependencies with `npm install --legacy-peer-deps`
- Build the project with `npm run build`
- Deploy to `dist/stellarium` directory

### 5. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Project Configuration

The repository includes `vercel.json` with optimized settings:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/stellarium",
  "devCommand": "npm run start",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "angular",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Environment Variables Reference

### Required Variables

- **GITHUB_TOKEN**: GitHub Personal Access Token for OpenAI API access
  - Get from: https://github.com/settings/personal-access-tokens
  - Scopes needed: `repo` access
  - Used for: AI horoscope generation

### Optional Variables

- **API_ENDPOINT**: Custom API endpoint (defaults to GitHub Models)
- **MODEL_NAME**: AI model name (defaults to gpt-4o-mini)

## Build Configuration

### Angular Build Settings

- **Framework**: Angular 20
- **Output**: `dist/stellarium`
- **Routing**: SPA with catch-all route to `index.html`
- **Assets**: Public folder contents served statically

### Dependencies

- Uses `--legacy-peer-deps` for ngx-owl-carousel-o compatibility
- All dependencies are pinned to specific versions

## Troubleshooting

### Build Errors

1. **Peer dependency issues**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment variable not found**:
   - Check Vercel dashboard Environment Variables
   - Ensure `GITHUB_TOKEN` is set for all environments

3. **Angular build errors**:
   - Check `angular.json` configuration
   - Verify all imports and dependencies

### Runtime Errors

1. **API calls failing**:
   - Verify GitHub token has correct permissions
   - Check browser console for CORS errors

2. **Routing issues**:
   - Ensure `vercel.json` has catch-all route configured
   - Check Angular router configuration

## Performance Optimization

### Bundle Size

Current build targets:
- Initial bundle: < 1MB
- Component styles: < 8kB

### Optimizations Applied

- Tree shaking enabled
- Output hashing for caching
- Lazy loading for components
- Optimized images in WebP format

## Monitoring

### Analytics

Vercel provides:
- Page views and unique visitors
- Core Web Vitals
- Function execution metrics

### Error Tracking

Monitor errors in:
- Vercel Function logs
- Browser console
- Network requests

## Security

### Environment Variables

- Never commit tokens to repository
- Use Vercel's secure environment variable storage
- Different tokens for different environments

### API Security

- GitHub token has minimal required permissions
- Client-side token usage (consider backend proxy for production)
- Rate limiting handled by GitHub API

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Visit [Angular on Vercel Guide](https://vercel.com/guides/deploying-angular-with-vercel)
- Open issue in repository