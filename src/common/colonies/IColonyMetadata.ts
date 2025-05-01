import {ColonyBenefit} from './ColonyBenefit';
import {Resource} from '../Resource';
import {ColonyName} from './ColonyName';
import {CardResource} from '../CardResource';
import {GameModule} from '../cards/GameModule';
import {OneOrArray} from '../utils/types';

export type IColonyMetadata = Readonly<{
  module?: GameModule; // TODO(kberg): attach gameModule to the server colonies themselves.
  name: ColonyName;
  description: {
    buildBonus: string,
    tradeBonus: string,
    colonyBonus: string,
  },
  buildType: ColonyBenefit;
  buildQuantity: Array<number>; // Default is [1,1,1]
  buildResource?: Resource;
  cardResource?: CardResource;
  tradeType: ColonyBenefit;
  tradeQuantity: Array<number>; // Default is [1,1,1,1,1,1,1]
  tradeResource?: OneOrArray<Resource>;
  colonyBonusType: ColonyBenefit;
  colonyBonusQuantity: number; // Default is 1
  colonyBonusResource?: Resource;
  shouldIncreaseTrack: 'yes' | 'no' | 'ask' // Default is 'yes';
}>;

export type IInputColonyMetadata = Omit<IColonyMetadata, 'buildQuantity' |'tradeQuantity' | 'colonyBonusQuantity' | 'shouldIncreaseTrack'> & Partial<IColonyMetadata>;

const DEFAULT_BUILD_QUANTITY = [1, 1, 1];
const DEFAULT_TRADE_QUANTITY = [1, 1, 1, 1, 1, 1, 1];

export function colonyMetadata(partial: IInputColonyMetadata): IColonyMetadata {
  return {
    buildQuantity: DEFAULT_BUILD_QUANTITY,
    tradeQuantity: DEFAULT_TRADE_QUANTITY,
    colonyBonusQuantity: 1,
    shouldIncreaseTrack: 'yes',
    ...partial,
  };
}
