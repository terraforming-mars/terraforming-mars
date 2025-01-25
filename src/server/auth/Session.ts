import {DiscordUser} from '../server/auth/discord';

export type SessionId = string;

export type Session = {
  id: SessionId;
  discordUser: DiscordUser;
  expirationDateMillis: number;
}
