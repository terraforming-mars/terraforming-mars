import {TemporaryBonusToken, UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';
import {ClaimedToken} from '../../common/underworld/UnderworldPlayerData';
import {Space} from '../boards/Space';

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

export type TokenSources = {
  spaces: Array<Space>,
  tokens: Array<UndergroundResourceToken>,
}
