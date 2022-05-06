import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../Resources';
import {ShouldIncreaseTrack} from './ShouldIncreaseTrack';
import {ColonyName} from './ColonyName';
import {CardResource} from '../CardResource';
import {GameModule} from '../cards/GameModule';

export interface IColonyMetadata {
  module?: GameModule; // TODO(kberg): attach gameModule to the server colonies themselves.
  readonly name: ColonyName;
  readonly buildType: ColonyBenefit;
  readonly buildQuantity: Array<number>; // Default is [1,1,1]
  readonly buildResource?: Resources;
  readonly resourceType?: CardResource;
  readonly tradeType: ColonyBenefit;
  readonly tradeQuantity: Array<number>; // Default is [1,1,1,1,1,1,1]
  readonly tradeResource?: Resources | Array<Resources>;
  readonly colonyBonusType: ColonyBenefit;
  readonly colonyBonusQuantity: number; // Default is 1
  readonly colonyBonusResource?: Resources;
  readonly shouldIncreaseTrack: ShouldIncreaseTrack // Default is ShouldIncreaseTrack.YES;
}

export type IInputColonyMetadata = Omit<IColonyMetadata, 'buildQuantity' |'tradeQuantity' | 'colonyBonusQuantity' | 'shouldIncreaseTrack'> & Partial<IColonyMetadata>;

const DEFAULT_BUILD_QUANTITY = [1, 1, 1];
const DEFAULT_TRADE_QUANTITY = [1, 1, 1, 1, 1, 1, 1];

export function colonyMetadata(partial: IInputColonyMetadata): IColonyMetadata {
  return {
    buildQuantity: DEFAULT_BUILD_QUANTITY,
    tradeQuantity: DEFAULT_TRADE_QUANTITY,
    colonyBonusQuantity: 1,
    shouldIncreaseTrack: ShouldIncreaseTrack.YES,
    ...partial,
  };
}
