# Terraforming Mars - Slack `/tm-newgame` bot

A standalone Vercel serverless app that lets anyone in a Slack workspace type
`/tm-newgame`, fill a small modal (Slack users, colors, board, expansions),
and DM each player their personal Terraforming Mars game link.

The bot does not touch the Terraforming Mars source tree. It is an external
HTTP client that calls `POST /api/creategame` on a TM server (defaults to the
community-run `https://terraforming-mars.herokuapp.com` instance).

## How it works

```
Host in Slack -> /tm-newgame -> Slack -> Vercel function (this bot)
                                    \-> POST /api/creategame -> TM server
                                    \-> chat.postMessage -> each player's DM
```

- HTTP mode (not Socket Mode). One Vercel function at `api/slack/events.ts`.
- `@slack/bolt` for routing slash commands and view submissions.
- `@vercel/functions` `waitUntil` for post-ack DM delivery (Slack requires
  acknowledging within 3 seconds; DMing every player takes longer).

## Quick start

Setting this up takes about 20 minutes and is split across two guides because
Slack and Vercel each need information the other produces:

1. **[SLACK_SETUP.md](./SLACK_SETUP.md) Part A** - Create the Slack app from
   the manifest, copy out the Bot Token and Signing Secret. (~5 min)
2. **[DEPLOY.md](./DEPLOY.md)** - Push to GitHub, import this `slack-bot/`
   directory into Vercel, set the two tokens as env vars, deploy, copy the
   production URL. (~10 min)
3. **[SLACK_SETUP.md](./SLACK_SETUP.md) Part B** - Paste the Vercel URL into
   the Slack app's slash-command + interactivity URLs, reinstall, test
   `/tm-newgame`. (~3 min)

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SLACK_BOT_TOKEN` | yes | `xoxb-...` from the Slack app's OAuth & Permissions page. |
| `SLACK_SIGNING_SECRET` | yes | From the Slack app's Basic Information page. Bolt verifies every incoming request with this. |
| `TM_BASE_URL` | no | Defaults to `https://terraforming-mars.herokuapp.com`. Set to your own TM origin if self-hosting. |

## Local development

Tested with Node 20+.

```bash
cd slack-bot
npm install
cp .env.sample .env.local        # then fill in real values
npm test                         # run the unit suite (Vitest)
npm run typecheck                # tsc --noEmit
npm run dev                      # vercel dev (needs ngrok in another terminal)
```

See [DEPLOY.md](./DEPLOY.md) "Local development" for the full ngrok recipe.

## Project layout

```
slack-bot/
├── api/slack/events.ts          # Vercel function entry
├── public/index.html            # Landing page at the root URL (also satisfies Vercel's default outputDirectory)
├── src/
│   ├── app.ts                   # Bolt App + Vercel receiver (lazy init)
│   ├── receiver.ts              # Custom Web-standards Receiver
│   ├── views/
│   │   ├── newGameView.ts       # Block Kit modal builder
│   │   └── prefill.ts           # Compact "same settings again" payload
│   ├── handlers/
│   │   ├── onSlashCommand.ts
│   │   ├── onViewSubmission.ts
│   │   ├── onRematchAction.ts   # "New game, same settings" button
│   │   └── parseSubmission.ts   # view.state.values -> NewGameConfig
│   ├── slack/notify.ts          # conversations.open + chat.postMessage helpers
│   └── tm/
│       ├── types.ts             # Duplicated from src/common/* in TM repo
│       ├── defaults.ts          # Full NewGameConfig defaults
│       └── createGame.ts        # POST /api/creategame
├── tests/
├── slack-app-manifest.yaml      # Paste into "Create app from manifest"
├── vercel.json
├── package.json
└── tsconfig.json
```

## What the modal exposes

- Up to 6 players, each picking a Slack user + color.
- "Random first player?" checkbox plus an optional explicit first-player slot.
- Board (Tharsis / Hellas / Elysium / Utopia / Vastitas Borealis Nova / Terra
  Cimmeria Nova / Arabia Terra / Vastitas Borealis / Amazonis / T. Cimmeria /
  Hollandia / Random official / Random all).
- Expansions (Corporate Era, Promo, Venus Next, Colonies, Prelude, Prelude 2,
  Turmoil, Community, Ares, Moon, Pathfinders, CEOs, Star Wars, Underworld,
  Delta Project).
- Common toggles (undo, timers, fast mode, draft, initial draft, show others'
  VP, solar phase, two corporations, no negative global events, shuffle map).
- Corporations dealt per player (1-6, defaulting to 3) and starting preludes
  per player.
- Escape Velocity (off / on, with a configurable threshold time in minutes,
  defaulting to 20).

## Playing again with the same settings

The summary DM the host receives after each game carries a **New game, same
settings** button. Clicking it reopens the modal with the previous game's
players, colors, board, expansions and options already filled in - change
anything you like, or just hit *Create game*.

The bot has no database. The settings ride along inside the button's own
Block Kit `value` (see `src/views/prefill.ts`), which Slack caps at 2000
characters; `encodePrefill` returns `undefined` above that and the button is
simply omitted. A button from an older deploy whose payload no longer parses
opens a blank modal rather than failing.

**Not exposed** to keep the modal under Slack's element-size limits: custom
corporations / banned cards / included cards / custom CEOs / custom preludes /
custom colonies (these fields are sent as empty arrays), and starting CEOs
per player (the CEOs expansion is off by default; the server default of 3
still applies if you turn it on). The web `New Game` form remains the place
to use those.

## Costs

Vercel Hobby tier is free for non-commercial use. The bot's monthly footprint
fits in the free function invocation / bandwidth / execution-time quotas
unless you create thousands of games per month.

## License

Same as the parent terraforming-mars repository.
