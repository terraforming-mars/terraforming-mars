export type DiscordUser = {
  id: string // the user's id identify
  username: string // the user's username, not unique across the platform identify
  discriminator: string // the user's Discord-tag identify
  global_name?: string // the user's display name, if it is set. For bots, this is the application name identify
  avatar?: string // the user's avatar hash identify
  bot?: boolean // whether the user belongs to an OAuth2 application identify
  system?: boolean // whether the user is an Official Discord System user (part of the urgent message system) identify
  mfa_enabled?: boolean // whether the user has two factor enabled on their account identify
  banner?: string // the user's banner hash identify
  accent_color?: number // the user's banner color encoded as an number representation of hexadecimal color code identify
  locale?: string // the user's chosen language option identify
  verified?: boolean // whether the email on this account has been verified email
  email?: string // the user's email email
  flags?: number // the flags on a user's account identify
  premium_type?: number // the type of Nitro subscription on a user's account identify
  public_flags?: number // the public flags on a user's account identify
  avatar_decoration_data?: any // data for the user's avatar decoration
};

export async function getDiscordUser(code: string): Promise<DiscordUser> {
  const data = {
    client_id: process.env['DISCORD_CLIENT_ID'] || '',
    client_secret: process.env['DISCORD_CLIENT_SECRET'] || '',
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:8080/auth/discord/callback',
    code: code,
    scope: 'identify',
  };

  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const tokenData = await tokenResponse.json();

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${tokenData.token_type} ${tokenData.access_token}`,
    },
  });
  const discordUser = await userResponse.json();
  return discordUser;
}

