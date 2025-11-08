import {TemporaryBonusToken, UndergroundResourceToken} from './UndergroundResourceToken';

export type ClaimedToken = {
  token: UndergroundResourceToken;
  shelter: boolean;
  active: boolean;
}

export type UnderworldPlayerData = {
  corruption: number;
  activeBonus: TemporaryBonusToken | undefined;
  tokens: Array<ClaimedToken>,
}
