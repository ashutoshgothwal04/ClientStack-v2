# Implementation Plan - Backend Services

This plan outlines the creation of a Node.js backend to support Inngest scheduling, Supabase administration, and React Email.

## User Review Required

> [!IMPORTANT]
> A new `server` directory will be created. You will need to run the backend server alongside the frontend Vite app.

## Proposed Changes

### Backend Setup (`/server`)

#### [NEW] [package.json](file:///d:/projects/cliendStack/server/package.json)
-   Initialize new Node.js project.
-   Dependencies: `express`, `inngest`, `dotenv`, `cors`, `@supabase/supabase-js`, `react-email`, `@react-email/components`, `nodemailer` (or similar for actual sending).

#### [NEW] [index.js](file:///d:/projects/cliendStack/server/index.js)
-   Main entry point.
-   Express app setup with CORS and JSON parsing.
-   Inngest `serve` handler at `/api/inngest`.

### Inngest Integration

#### [NEW] [inngest/client.js](file:///d:/projects/cliendStack/server/inngest/client.js)
-   Initialize Inngest client with App ID.

#### [NEW] [inngest/functions/helloWorld.js](file:///d:/projects/cliendStack/server/inngest/functions/helloWorld.js)
-   Example scheduled function (e.g., runs every hour or on trigger).

#### [NEW] [inngest/functions/sendWelcomeEmail.js](file:///d:/projects/cliendStack/server/inngest/functions/sendWelcomeEmail.js)
-   Function triggered by `user.signup` event.
-   Sends email using React Email template.

### React Email

#### [NEW] [emails/WelcomeEmail.jsx](file:///d:/projects/cliendStack/server/emails/WelcomeEmail.jsx)
-   React component for the welcome email template.

### Supabase Integration

#### [NEW] [supabase/client.js](file:///d:/projects/cliendStack/server/supabase/client.js)
-   Initialize Supabase Admin client (requires Service Role Key for backend actions, or reuse Anon for now if user doesn't have Service Key - *Note: I will ask user for Service Role Key or use Anon if not available, but backend usually needs Service Role for admin tasks. For now, I'll use Anon and note to upgrade.*)

## Verification Plan

### Automated Tests
-   **Backend Health Check:** `curl http://localhost:3000/` should return 200 OK.
-   **Inngest Endpoint:** `curl -X PUT http://localhost:3000/api/inngest` (internal check by Inngest dev server).

### Manual Verification
1.  **Start Backend:** Run `npm run dev` in `server/`.
2.  **Start Inngest Dev Server:** Run `npx inngest-cli@latest dev` (I will add a script for this).
3.  **Trigger Function:** Use Inngest Dashboard (http://localhost:8288) to manually trigger `user.signup`.
4.  **Verify Email:** Check console logs for "Email sent" (since we might not have a real SMTP set up yet, I'll mock the send function first).
