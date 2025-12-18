# Auth0 Setup Guide for Unstoppable Threads

This guide walks you through setting up Auth0 authentication for the Unstoppable Threads application.

## Prerequisites

- An Auth0 account (sign up at [auth0.com](https://auth0.com))
- Access to your Lovable project

## Step 1: Create an Auth0 Application

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **+ Create Application**
4. Enter a name (e.g., "Unstoppable Threads")
5. Select **Single Page Web Applications**
6. Click **Create**

## Step 2: Configure Application Settings

After creating the application, go to the **Settings** tab and configure:

### Basic Information
- **Name**: Unstoppable Threads
- **Application Type**: Single Page Application

### Application URIs

Replace `YOUR_LOVABLE_URL` with your actual Lovable preview/production URL.

**Allowed Callback URLs:**
```
https://YOUR_LOVABLE_URL,
http://localhost:5173,
http://localhost:3000
```

**Allowed Logout URLs:**
```
https://YOUR_LOVABLE_URL,
http://localhost:5173,
http://localhost:3000
```

**Allowed Web Origins:**
```
https://YOUR_LOVABLE_URL,
http://localhost:5173,
http://localhost:3000
```

> **Note**: Separate multiple URLs with commas. Add your production domain when you deploy.

### Example URLs
If your Lovable preview URL is `https://preview--f7f3fe94-8525-417e-9d2d-8d49705bf164.lovable.app`, your settings would be:

```
Allowed Callback URLs:
https://preview--f7f3fe94-8525-417e-9d2d-8d49705bf164.lovable.app,http://localhost:5173

Allowed Logout URLs:
https://preview--f7f3fe94-8525-417e-9d2d-8d49705bf164.lovable.app,http://localhost:5173

Allowed Web Origins:
https://preview--f7f3fe94-8525-417e-9d2d-8d49705bf164.lovable.app,http://localhost:5173
```

## Step 3: Get Your Credentials

From the **Settings** tab, copy:

1. **Domain** (e.g., `your-tenant.auth0.com`)
2. **Client ID** (e.g., `abc123xyz...`)
3. **Client Secret** (for backend use only - keep this secure!)

## Step 4: Configure Environment Variables in Lovable

Add these secrets in your Lovable project:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VITE_AUTH0_DOMAIN` | `your-tenant.auth0.com` | Your Auth0 domain |
| `VITE_AUTH0_CLIENT_ID` | `your-client-id` | Your Auth0 client ID |
| `AUTH0_CLIENT_SECRET` | `your-client-secret` | For backend use (edge functions) |

## Step 5: Enable Social Connections (Optional)

To allow users to sign in with Google, Facebook, etc.:

1. Go to **Authentication** → **Social**
2. Enable desired connections (Google, Facebook, Apple, etc.)
3. Configure each provider with your API keys

### Google Sign-In Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Create an **OAuth 2.0 Client ID**
5. Add authorized redirect URI: `https://YOUR_AUTH0_DOMAIN/login/callback`
6. Copy Client ID and Client Secret to Auth0

## Step 6: Customize Login Page (Optional)

1. Go to **Branding** → **Universal Login**
2. Choose a template or customize colors/logo
3. Match your brand colors:
   - Primary Color: Use your brand accent color
   - Page Background: Match your app's theme

## Step 7: Configure Database Connection

1. Go to **Authentication** → **Database**
2. Click on **Username-Password-Authentication**
3. Configure settings:
   - **Requires Username**: Off (use email only)
   - **Disable Sign Ups**: Off (allow new users)

## Testing Your Setup

1. Visit your app's `/auth` page
2. Click "Login / Sign Up"
3. You should see Auth0's Universal Login page
4. Test with:
   - Email/password signup
   - Social login (if configured)

## Troubleshooting

### "Callback URL mismatch" Error
- Ensure your app's URL is in **Allowed Callback URLs**
- Check for trailing slashes - be consistent
- URLs are case-sensitive

### "Origin not allowed" Error
- Add your URL to **Allowed Web Origins**
- Include both `http` and `https` if needed

### Login Redirects to Wrong URL
- Check **Allowed Callback URLs** configuration
- Verify `redirect_uri` in your code matches

### Social Login Not Working
- Verify social connection is enabled
- Check API keys are correctly configured
- Ensure redirect URIs are set in provider's console

## Security Best Practices

1. **Never expose Client Secret** in frontend code
2. **Use HTTPS** in production
3. **Rotate secrets** periodically
4. **Enable MFA** for admin accounts
5. **Monitor logs** in Auth0 Dashboard

## Additional Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login)
- [Auth0 Social Connections](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers)

## Support

For Auth0 issues, check:
- [Auth0 Community](https://community.auth0.com/)
- [Auth0 Support](https://support.auth0.com/)
