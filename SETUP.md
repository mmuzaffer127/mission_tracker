# 🚀 MISSION OS — Production Authentication & Setup Guide

This guide details the complete setup for **Google OAuth (Gmail)**, **Real Phone OTP (SMS)**, **Email Verification with 6-Digit Code**, and the **Database Profiles Migration**.

---

## 1. 🗄️ Database Migration (SQL Setup in Supabase)

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/fphwdupxdkvfpywpbptk](https://supabase.com/dashboard/project/fphwdupxdkvfpywpbptk)
2. In the left navigation, click on **SQL Editor**.
3. Click **+ New Query**.
4. Open the migration file:
   `supabase/migrations/20261109_auth_profiles.sql`
5. Paste the entire SQL script into the query editor and click **Run**.
6. This creates:
   - `public.profiles` table linked to `auth.users(id)` with cascading deletes.
   - Row Level Security (RLS) policies allowing users to view and update only their own profile.
   - The `handle_new_user()` trigger that automatically copies Google OAuth name, avatar, email, and phone into `public.profiles`.

---

## 2. 🌐 Google OAuth (Gmail Login) Setup

### Step A: Google Cloud Console Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project (e.g. `Mission-OS-Auth`).
3. In the left menu, navigate to **APIs & Services** > **OAuth consent screen**:
   - Choose **External** and click **Create**.
   - Fill in:
     - **App name**: `Mission OS`
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Under **Scopes**, add `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
   - Save and continue.
4. Navigate to **APIs & Services** > **Credentials**:
   - Click **+ Create Credentials** > **OAuth client ID**.
   - **Application type**: `Web application`.
   - **Name**: `Mission OS Supabase Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `https://fphwdupxdkvfpywpbptk.supabase.co`
     - Your production domain (when deployed)
   - **Authorized redirect URIs**:
     - `https://fphwdupxdkvfpywpbptk.supabase.co/auth/v1/callback`
   - Click **Create**.
   - Copy the **Client ID** and **Client Secret**.

### Step B: Supabase Auth Provider Configuration
1. In your Supabase Dashboard, go to **Authentication** > **Providers**.
2. Click on **Google**:
   - Toggle **Enable Sign in with Google** to **ON**.
   - Paste your **Client ID**.
   - Paste your **Client Secret**.
   - Click **Save**.

### Step C: Configure Supabase Redirect URLs
1. In your Supabase Dashboard, go to **Authentication** > **URL Configuration**.
2. Set **Site URL** to:
   `http://localhost:5173`
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/**`
4. Click **Save**.

---

## 3. 📱 Real Phone OTP (SMS) Provider Setup

Supabase Auth uses SMS gateways (Twilio, MessageBird, Vonage, or AWS SNS) to deliver real 6-digit SMS OTP tokens.

1. In your Supabase Dashboard, go to **Authentication** > **Providers**.
2. Click on **Phone**:
   - Toggle **Enable Phone Provider** to **ON**.
   - Choose your SMS provider (e.g., **Twilio** is recommended):
     - **Twilio Account SID**: Your Twilio SID from [twilio.com/console](https://www.twilio.com/console)
     - **Twilio Auth Token**: Your Twilio Auth Token
     - **Twilio Message Service SID** or **Twilio Phone Number** (e.g., `+1xxxxxxxxxx`)
3. **Note for India (+91 numbers)**:
   - Due to TRAI regulations in India, transactional SMS requires DLT (Distributed Ledger Technology) template registration on Twilio/Indian telecom gateways.
   - For global testing or immediate deployment, you can verify phone numbers directly in your Twilio Sandbox Console.
4. Click **Save**.

---

## 4. ✉️ Email Verification & 6-Digit Token Template

To enable real 6-digit verification codes for Email Sign-Up instead of magic links:

1. In Supabase Dashboard, go to **Authentication** > **Email Templates**.
2. Click on **Confirm signup**:
   - Change the email subject to: `Your Mission OS Verification Code`
   - In the email body, make sure `{{ .Token }}` is present, for example:
     ```html
     <h2>Confirm Your Mission OS Operative Account</h2>
     <p>Your 6-digit verification code is:</p>
     <h1 style="font-size: 32px; letter-spacing: 4px; font-family: monospace;">{{ .Token }}</h1>
     <p>This code will expire in 15 minutes. Enter this code on the Mission OS sign-up screen to activate your command center.</p>
     ```
3. Click **Save Changes**.

---

## 5. 💻 Running the App Locally

### Terminal 1 — Backend Server (Port 5000)
```powershell
npm.cmd --prefix server run start
```
*Health check:* [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Terminal 2 — Frontend Client (Port 5173)
```powershell
npm.cmd --prefix client run dev
```
*App URL:* [http://localhost:5173](http://localhost:5173)

---

## 6. 🧪 End-to-End Verification Checklist

| Method | Expected Flow |
|---|---|
| **Google (Gmail)** | Click "Continue with Google" -> Select Google Account -> Redirects to `/auth/callback` -> Lands on `/dashboard` with your Google name & avatar |
| **Phone OTP** | Select country code (+91 default) -> Enter phone -> Receive 6-digit SMS -> Enter OTP with auto-advance -> First login prompts for Call-sign -> Lands on `/dashboard` |
| **Email Sign-Up** | Enter Name, Email, Password (8+ chars) -> Receive 6-digit OTP in inbox -> Enter code on screen -> Account verified -> Lands on `/dashboard` |
| **Email Login** | Enter verified Email & Password -> Instant authentication to `/dashboard` |
| **Guest Sandbox** | Click "Continue in Guest Sandbox Mode" on login screen -> Direct exploration with demo commander persona |
| **Public About Page** | Visit `/about` -> Accessible both logged-out and logged-in -> Interactive feature cards & 3-step workflow -> Dynamic CTA buttons |
| **Session Security** | Automatic token refresh, protected routes redirect unauthenticated users to `/login`, and secure logout clears all tokens |

