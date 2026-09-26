# Vercel deployment guide

Vercel-only. This guide assumes you've already finished
[SLACK_SETUP.md](./SLACK_SETUP.md) **Part A** and have the Bot Token
(`xoxb-...`) and Signing Secret on hand.

After this guide, finish with [SLACK_SETUP.md](./SLACK_SETUP.md) **Part B** to
point your Slack app at the deployed bot.

## Prerequisites

- A **GitHub account** with the `terraforming-mars` repo pushed (your fork,
  or any repo containing this `slack-bot/` directory).
- A **Vercel account** (free Hobby tier works) - sign up at
  https://vercel.com/signup using "Continue with GitHub" so the two are
  linked.
- The two values from [SLACK_SETUP.md](./SLACK_SETUP.md) Part A:
  `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`.

## Step 1 - Import the repo into Vercel

1. Go to https://vercel.com/new.
2. Under **Import Git Repository**, find your `terraforming-mars` fork. If
   you don't see it, click **Adjust GitHub App Permissions** and grant
   Vercel access to that repo.
3. Click **Import** next to the repo. You'll see the **Configure Project**
   screen.
4. **Critical** - set the **Root Directory** to `slack-bot`.
   - Click the **Edit** button next to Root Directory.
   - Type `slack-bot`.
   - Click **Continue**.
   - Without this, Vercel will try to build the full TM repo, which won't
     work and will fail with a long compile error.
5. The **Framework Preset** should auto-detect as **Other** (or leave it on
   **Other**). The **Build Command** and **Output Directory** can stay on
   their defaults - Vercel detects the `api/` folder convention automatically.
6. **Don't click Deploy yet** - first expand the **Environment Variables**
   section (Step 2).

## Step 2 - Set environment variables

In the same **Configure Project** screen (or later under **Project Settings ->
Environment Variables**), add the variables below. For each, leave the
default checkboxes on for **Production**, **Preview**, and **Development**.

| Name | Value | Source |
| --- | --- | --- |
| `SLACK_BOT_TOKEN` | `xoxb-...` | [SLACK_SETUP.md](./SLACK_SETUP.md) Part A step 8 |
| `SLACK_SIGNING_SECRET` | long hex string | [SLACK_SETUP.md](./SLACK_SETUP.md) Part A step 7 |
| `TM_BASE_URL` | `https://terraforming-mars.herokuapp.com` | Optional. Defaults to the community-run TM instance if unset. Override only if you self-host TM. |
| `CLAUDE_OPERATOR_SLACK_USER_ID` | `U0123ABCD` | Optional. Slack user id (or set `CLAUDE_OPERATOR` to a name) of the person who runs Claude Code; receives Claude's player link when a game includes Claude. Defaults to `DEFAULT_CLAUDE_OPERATOR` in `src/claude.ts` ("Simas Glinskis", looked up by name), then the host. Find it in Slack via the person's profile -> **...** -> **Copy member ID**. |
| `CLAUDE_PLAYER_NAME` | `Claude` | Optional. Player name Claude is seated under. Defaults to `Claude`. |

## Step 3 - Deploy

1. Back on the **Configure Project** screen, click **Deploy**.
2. Wait ~30-60 seconds for the build. You'll get a green checkmark and a
   URL like `https://terraforming-mars-<hash>.vercel.app`.
3. Click **Continue to Dashboard**. Note the production domain shown at
   the top - this is `<your-vercel-domain>` for the next step.

Future commits to your default branch will auto-deploy. To deploy a one-off
without pushing:

```bash
npm i -g vercel
cd slack-bot
vercel link        # one-time, links this folder to the Vercel project
vercel deploy --prod
```

## Step 4 - Return to SLACK_SETUP.md Part B

Now point the Slack app at `https://<your-vercel-domain>/api/slack/events`
and reinstall - see [SLACK_SETUP.md](./SLACK_SETUP.md) **Part B**. Then
test `/tm-newgame` in your workspace.

## Local development (optional)

Slack must reach your bot over HTTPS, so local development needs a public
tunnel:

1. `cd slack-bot && npm install`
2. Copy `.env.sample` to `.env.local` and fill in the same env vars.
3. Run the dev server:
   ```bash
   npx vercel dev
   ```
   This binds to `http://localhost:3000`.
4. In another terminal, expose it over HTTPS:
   ```bash
   npx ngrok http 3000
   ```
   Copy the `https://...ngrok-free.app` URL it prints.
5. In the Slack app config (the same screens as
   [SLACK_SETUP.md](./SLACK_SETUP.md) Part B), temporarily replace the
   Vercel URL with `https://<ngrok-id>.ngrok-free.app/api/slack/events` in
   both the slash command and Interactivity sections. **Don't forget to
   switch them back** when you're done, or production will break.

## Updating after the initial deploy

- **Code changes**: commit & push to GitHub. Vercel auto-deploys (~30s).
- **Env var changes**: Vercel project **Settings -> Environment Variables**.
  After saving, click **Deployments -> ... menu -> Redeploy** on the latest
  deployment to pick them up.
- **Manifest changes**: re-paste the manifest YAML into the Slack app's
  **App Manifest** page (under "Features" left-sidebar group), or click
  **Update Manifest**. Then reinstall the app to your workspace.

## Cost

Vercel Hobby tier is free for personal/non-commercial use. This bot's
monthly footprint fits well inside the free quotas (function invocations,
bandwidth, function-execution-seconds) unless you create thousands of games
per month.

## Troubleshooting

- **Build fails with `Cannot find module @slack/bolt`** - confirm Root
  Directory is set to `slack-bot` (Step 1.4). Vercel runs `npm install` in
  the Root Directory; if it's set to the repo root, it ignores
  `slack-bot/package.json` and you get this error.
- **Build fails with `No Output Directory named "public" found`** - this
  means Vercel didn't find the `slack-bot/public/` landing page that ships
  with this project. Most often the cause is Root Directory set to the
  repo root instead of `slack-bot` (see above). Confirm `slack-bot/public/index.html`
  exists in your fork and is being included in deployment. As a workaround,
  in **Project Settings -> Build & Development Settings** you can set
  **Output Directory** to `public` and click **Save**, then redeploy.
- **Visiting `https://<your-vercel-domain>/` shows the "Terraforming Mars
  Slack bot - live" landing page** - that's intentional. It confirms the
  function is deployed and reachable. The actual Slack endpoint lives at
  `/api/slack/events` and only accepts POSTs from Slack.
- **Deployment succeeds but `/tm-newgame` returns "dispatch_failed"** - open
  the Vercel project -> **Logs**. The most common causes are missing/typo'd
  env vars and signature mismatches (re-copy `SLACK_SIGNING_SECRET`
  carefully, no leading/trailing spaces).
- **Modal opens but submission times out** - the function exceeded the
  `maxDuration: 30` budget. The most common cause is a slow upstream TM
  server. Check `vercel.json` and the Vercel logs.
