/**
 * Helpers for the optional "Claude plays" seat.
 *
 * Claude is not a Slack user - it is an AI agent run from Claude Code on
 * somebody's machine, and it plays by being handed its /player?id=... URL.
 * So instead of DMing Claude, the bot DMs the human who runs Claude Code
 * (the "operator") a message carrying the URL, a ready-to-paste Claude Code
 * command, and a stable marker line an automated watcher can grep for.
 */

export const DEFAULT_CLAUDE_PLAYER_NAME = 'Claude';

/**
 * Prefix of the machine-readable line in the operator DM. Watchers should
 * match `TM-CLAUDE-SEAT <url>`; note that Slack may return the URL wrapped
 * as `<https://...>` in the message `text`, so a tolerant regex is
 * `/TM-CLAUDE-SEAT <?(https?:\/\/[^\s>|]+)/`.
 */
export const CLAUDE_SEAT_MARKER = 'TM-CLAUDE-SEAT';

/** Player name Claude is seated under. Env CLAUDE_PLAYER_NAME, default "Claude". */
export function claudePlayerName(): string {
  const raw = process.env.CLAUDE_PLAYER_NAME?.trim();
  return raw === undefined || raw === '' ? DEFAULT_CLAUDE_PLAYER_NAME : raw;
}

/**
 * Who runs Claude Code and receives Claude's link, when no env var is set.
 * A display/real name (resolved against the workspace at runtime) or a
 * Slack member id. Hardcoded for now: there is a single operator.
 */
export const DEFAULT_CLAUDE_OPERATOR = 'Simas Glinskis';

const SLACK_USER_ID = /^[UW][A-Z0-9]{6,}$/;

/**
 * The configured operator: env CLAUDE_OPERATOR_SLACK_USER_ID, else env
 * CLAUDE_OPERATOR, else DEFAULT_CLAUDE_OPERATOR. May be a member id or a name.
 */
export function claudeOperatorSetting(): string {
  for (const key of ['CLAUDE_OPERATOR_SLACK_USER_ID', 'CLAUDE_OPERATOR']) {
    const raw = process.env[key]?.trim();
    if (raw !== undefined && raw !== '') return raw;
  }
  return DEFAULT_CLAUDE_OPERATOR;
}

/** Minimal slice of WebClient used for the name lookup (keeps tests simple). */
export interface UsersListClient {
  users: {
    list(args: {limit?: number; cursor?: string}): Promise<{
      members?: Array<{
        id?: string;
        name?: string;
        real_name?: string;
        deleted?: boolean;
        is_bot?: boolean;
        profile?: {real_name?: string; display_name?: string};
      }>;
      response_metadata?: {next_cursor?: string};
    }>;
  };
}

const normalizeName = (s: string | undefined): string =>
  (s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

/**
 * Resolve the operator to a Slack member id. Ids are returned as-is; names
 * are matched (case-insensitive) against real name, display name and handle
 * via users.list (needs the users:read scope the bot already has). Falls back
 * to the game's host if nothing matches or the lookup fails.
 */
export async function resolveClaudeOperator(
  client: UsersListClient,
  hostUserId: string,
): Promise<string> {
  const setting = claudeOperatorSetting();
  if (SLACK_USER_ID.test(setting)) return setting;
  const target = normalizeName(setting);
  try {
    let cursor: string | undefined;
    do {
      const res = await client.users.list({limit: 200, cursor});
      const match = res.members?.find((m) =>
        m.id !== undefined && m.deleted !== true && m.is_bot !== true &&
        [m.real_name, m.profile?.real_name, m.profile?.display_name, m.name]
          .some((n) => normalizeName(n) === target));
      if (match?.id !== undefined) return match.id;
      cursor = res.response_metadata?.next_cursor || undefined;
    } while (cursor !== undefined);
    console.warn('[slack-bot] Claude operator not found, falling back to host', {setting});
  } catch (err) {
    console.error('[slack-bot] Claude operator lookup failed, falling back to host', err);
  }
  return hostUserId;
}

/** The exact marker line, e.g. `TM-CLAUDE-SEAT https://.../player?id=p123`. */
export function claudeSeatMarkerLine(playerUrl: string): string {
  return `${CLAUDE_SEAT_MARKER} ${playerUrl}`;
}

/** The Claude Code command that starts Claude playing the seat. */
export function claudeCodeCommand(playerUrl: string): string {
  return `/terraforming-mars ${playerUrl} play`;
}
