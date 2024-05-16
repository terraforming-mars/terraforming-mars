import {UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';

export type UnderworldData = {
  tokens: Array<UndergroundResourceToken>;
};

type TemperatureBonuses = 'data1pertemp' | 'microbe1pertemp' | 'plant2pertemp' | 'steel2pertemp' | 'titanium1pertemp';

export type UnderworldPlayerData = {
  corruption: number;
  temperatureBonus?: TemperatureBonuses,
}
