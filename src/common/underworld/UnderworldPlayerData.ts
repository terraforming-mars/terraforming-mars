import {TemporaryBonusToken, UndergroundResourceToken} from './UndergroundResourceToken';

export type UnderworldPlayerData = {
  corruption: number;
  activeBonus: TemporaryBonusToken | undefined;
  tokens: Array<UndergroundResourceToken>,
}
