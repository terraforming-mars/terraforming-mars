/**
 * Bolt App singleton plus VercelReceiver, constructed lazily so unit tests
 * can stub `process.env` before import.
 */

import {App} from '@slack/bolt';
import {VercelReceiver} from './receiver.js';
import {onSlashCommand, SLASH_COMMAND} from './handlers/onSlashCommand.js';
import {onRematchAction, REMATCH_ACTION_ID} from './handlers/onRematchAction.js';
import {onViewSubmission, VIEW_CALLBACK_ID} from './handlers/onViewSubmission.js';

let _receiver: VercelReceiver | undefined;
let _app: App | undefined;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (v === undefined || v === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export function getReceiver(): VercelReceiver {
  if (_receiver === undefined) {
    _receiver = new VercelReceiver({
      signingSecret: requireEnv('SLACK_SIGNING_SECRET'),
    });
  }
  return _receiver;
}

export function getApp(): App {
  if (_app === undefined) {
    _app = new App({
      token: requireEnv('SLACK_BOT_TOKEN'),
      receiver: getReceiver(),
      // Serverless: run listeners synchronously so they complete before the
      // function instance is torn down. Each listener still calls `ack()`
      // first to stay under Slack's 3-second response limit; long work is
      // scheduled via @vercel/functions `waitUntil`.
      processBeforeResponse: true,
    });

    _app.command(SLASH_COMMAND, onSlashCommand);
    _app.view(VIEW_CALLBACK_ID, onViewSubmission);
    _app.action(REMATCH_ACTION_ID, onRematchAction);
  }
  return _app;
}
