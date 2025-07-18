import {TemporaryBonusToken, UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';
import {ClaimedToken} from '../../common/underworld/UnderworldPlayerData';

export type UnderworldData = {
  tokens: Array<UndergroundResourceToken>;
};

export type SerializedUnderworldPlayerData = {
  corruption: number;
  temperatureBonus?: TemporaryBonusToken,
  activeBonus?: TemporaryBonusToken | undefined;
  // TODO(kberg): Remove ? 2025-10-01
  tokens?: Array<UndergroundResourceToken> | Array<ClaimedToken>,
}
