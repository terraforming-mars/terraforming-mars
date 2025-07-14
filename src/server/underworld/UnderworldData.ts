import {TemporaryBonusToken, UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';

export type UnderworldData = {
  tokens: Array<UndergroundResourceToken>;
};

export type UnderworldPlayerData = {
  corruption: number;
  activeBonus: TemporaryBonusToken | undefined;
  tokens: Array<UndergroundResourceToken>,
}

export type SerializedUnderworldPlayerData = {
  corruption: number;
  temperatureBonus?: TemporaryBonusToken,
  activeBonus?: TemporaryBonusToken | undefined;
  // TODO(kberg): Remove ? 2025-10-01
  tokens?: Array<UndergroundResourceToken>,
}
