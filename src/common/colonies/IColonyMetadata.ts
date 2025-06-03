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
  /**
   * If the player may increase the colony track, this determines whether to ask the player.
   *
   * Colonies that give resources should be set to 'yes' since they'll typically get more resources the higher
   * the track goes.
   *
   * Colonies should be set to 'no' when the the reward is worse the higher the track goes. (This is limited to Titania.)
   *
   * Mercury and Hygeia give _different_ rewards at different levels of the track, so it is worth asking the player whether
   * to move up the track.
   */
  shouldIncreaseTrack: 'yes' | 'no' | 'ask'
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
