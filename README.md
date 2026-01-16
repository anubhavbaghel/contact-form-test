# Contact Forms Comparison: reCAPTCHA vs Turnstile

A single-page contact form with tab switcher to compare Google reCAPTCHA and Cloudflare Turnstile side-by-side.

## ✨ Features

- 🔄 **Tab Switcher**: Toggle between reCAPTCHA and Turnstile forms
- 🎨 **Dual Themes**: Purple gradient for reCAPTCHA, Orange for Turnstile
- 🔒 **Both Captchas**: Compare user experience of both solutions
- 📱 **Responsive**: Works on all devices
- 📧 **Email Integration**: Optional Gmail sending

## 🚀 Quick Setup

### 1. Get API Keys

**Google reCAPTCHA:**
- Go to https://www.google.com/recaptcha/admin
- Create site with reCAPTCHA v2
- Copy Site Key and Secret Key

**Cloudflare Turnstile:**
- Go to https://dash.cloudflare.com/
- Navigate to Turnstile → Add Site
- Copy Site Key and Secret Key

### 2. Update Site Keys

Edit `index.html`:
- Line ~155: Replace `YOUR_RECAPTCHA_SITE_KEY_HERE`
- Line ~163: Replace `YOUR_TURNSTILE_SITE_KEY_HERE`

Edit `script.js`:
- Line ~48: Replace `YOUR_RECAPTCHA_SITE_KEY_HERE`
- Line ~57: Replace `YOUR_TURNSTILE_SITE_KEY_HERE`

### 3. Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

Then:
1. Go to vercel.com/new
2. Import your repository
3. Add environment variables:
   - `RECAPTCHA_SECRET_KEY`
   - `TURNSTILE_SECRET_KEY`
   - `GMAIL_USER` (optional)
   - `GMAIL_APP_PASSWORD` (optional)
   - `RECIPIENT_EMAIL` (optional)
4. Deploy!

## 📦 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA Secret Key | Yes |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile Secret Key | Yes |
| `GMAIL_USER` | Gmail for sending emails | No |
| `GMAIL_APP_PASSWORD` | Gmail App Password | No |
| `RECIPIENT_EMAIL` | Email to receive submissions | No |

## 🎯 Comparison

| Feature | reCAPTCHA | Turnstile |
|---------|-----------|-----------|
| Privacy | Tracks users | Privacy-first |
| UX | Image puzzles | Simple checkbox |
| Speed | Slower | Faster |
| Color | Purple | Orange |

## 📄 License

MIT

---

**Compare both captcha solutions in one place!**
