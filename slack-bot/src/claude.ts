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
 * Slack user who runs Claude Code and should receive Claude's link.
 * Env CLAUDE_OPERATOR_SLACK_USER_ID, falling back to the game's host.
 */
export function claudeOperatorUserId(hostUserId: string): string {
  const raw = process.env.CLAUDE_OPERATOR_SLACK_USER_ID?.trim();
  return raw === undefined || raw === '' ? hostUserId : raw;
}

/** The exact marker line, e.g. `TM-CLAUDE-SEAT https://.../player?id=p123`. */
export function claudeSeatMarkerLine(playerUrl: string): string {
  return `${CLAUDE_SEAT_MARKER} ${playerUrl}`;
}

/** The Claude Code command that starts Claude playing the seat. */
export function claudeCodeCommand(playerUrl: string): string {
  return `/terraforming-mars ${playerUrl} play`;
}
