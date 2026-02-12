# ClientStack Backend Walkthrough

This walkthrough guides you through running the new backend services, verifying the integration, and managing the database.

## 1. Prerequisites

Ensure you have the following environment variables in your root [.env](file:///d:/projects/cliendStack/.env) file (and `server/.env` will inherit them or you can copy them):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- (Optional) `SERVICE_ROLE_KEY` for admin tasks

## 2. Starting the Services

You need to run both the frontend and the backend.

### Backend & Inngest
Open a terminal and run:
```bash
# Install dependencies if you haven't yet (I ran this for you)
cd server
npm install --legacy-peer-deps

# Start the Backend Server
npm run dev
```

In a **separate** terminal, start the Inngest Dev Server (for scheduling/events):
```bash
cd server
npx inngest-cli@latest dev
```
Open [http://localhost:8288](http://localhost:8288) to view the Inngest Dashboard.

### Frontend
In another terminal, start your Vite app:
```bash
npm run dev
```

## 3. Database Setup (Supabase)

A comprehensive migration file is located at [supabase/migrations/20250805164831_user_profile_system.sql](file:///d:/projects/cliendStack/supabase/migrations/20250805164831_user_profile_system.sql).

To apply this:
1.  **Via CLI:** `npx supabase db push` (if you have the CLI configured).
2.  **Via Dashboard:** Copy the content of the SQL file and run it in the SQL Editor of your Supabase Dashboard.

This migration sets up:
-   `user_profiles`, `user_preferences`, `notification_settings` tables.
-   Triggers for new user signup.
-   RLS policies for security.
-   Mock data (admin@clientstack.com / Demo123!).

## 4. Verification

### Test Backend Connectivity
1.  Navigate to `http://localhost:5173/test-backend` in your browser.
2.  Click **"Check Connection"**. You should see "Backend Status: ClientStack Backend is running!".

### Test Inngest & Emails
1.  On the same test page, click **"Trigger Signup Event"**.
2.  Go to the **Inngest Dashboard** (http://localhost:8288).
3.  You should see a `user.signup` event and the `send-welcome-email` function executing.
4.  Check the **Backend Terminal**. You will see:
    ```
    [Mock Email] Sending to: test@example.com
    [Mock Email] Subject: Welcome to ClientStack!
    ```

## 5. Next Steps
-   **Email Provider:** Replace the mock email logging in [server/inngest/functions/sendWelcomeEmail.js](file:///d:/projects/cliendStack/server/inngest/functions/sendWelcomeEmail.js) with `resend` or `nodemailer` logic (commented out example included).
-   **Service Role:** Add `SERVICE_ROLE_KEY` to your [.env](file:///d:/projects/cliendStack/.env) for advanced admin capabilities in [server/supabase/client.js](file:///d:/projects/cliendStack/server/supabase/client.js).
