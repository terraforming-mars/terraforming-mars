import {DiscordUser} from '../server/auth/discord';

export type SessionId = string;
export type SessionData = {
  discordUser: DiscordUser;
}

export type Session = {
  id: SessionId;
  data: SessionData;
  expirationTimeMillis: number;
}
