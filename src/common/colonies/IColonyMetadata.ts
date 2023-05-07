import {ColonyBenefit} from './ColonyBenefit';
import {Resource} from '../Resource';
import {ColonyName} from './ColonyName';
import {CardResource} from '../CardResource';
import {GameModule} from '../cards/GameModule';

export interface IColonyMetadata {
  module?: GameModule; // TODO(kberg): attach gameModule to the server colonies themselves.
  readonly name: ColonyName;
  readonly buildType: ColonyBenefit;
  readonly buildQuantity: Array<number>; // Default is [1,1,1]
  readonly buildResource?: Resource;
  readonly cardResource?: CardResource;
  readonly tradeType: ColonyBenefit;
  readonly tradeQuantity: Array<number>; // Default is [1,1,1,1,1,1,1]
  readonly tradeResource?: Resource | Array<Resource>;
  readonly colonyBonusType: ColonyBenefit;
  readonly colonyBonusQuantity: number; // Default is 1
  readonly colonyBonusResource?: Resource;
  readonly shouldIncreaseTrack: 'yes' | 'no' | 'ask' // Default is 'yes';
}

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
