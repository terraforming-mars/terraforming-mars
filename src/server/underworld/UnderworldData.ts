import {UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';

export type UnderworldData = {
  tokens: Array<UndergroundResourceToken>;
};

type TemperatureBonuses = 'data1pertemp' | 'microbe1pertemp' | 'plant2pertemp' | 'steel2pertemp' | 'titanium1pertemp';

export type UnderworldPlayerData = {
  corruption: number;
  temperatureBonus?: TemperatureBonuses,
  tokens: Array<UndergroundResourceToken>,
}

export type SerializedUnderworldPlayerData = {
  corruption: number;
  temperatureBonus?: TemperatureBonuses,
  // TODO(kberg): Remove ? 2025-10-01
  tokens?: Array<UndergroundResourceToken>,
}
