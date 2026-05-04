import {ColonyBenefit} from './ColonyBenefit';
import {Resource} from '../Resource';
import {ColonyName} from './ColonyName';
import {CardResource} from '../CardResource';
import {Expansion, GameModule} from '../cards/GameModule';
import {OneOrArray} from '../utils/types';

// Describes a colony benefit: the effect granted when building, trading, or receiving a colony bonus.
// quantity is OneOrArray<number>: a scalar for colony bonuses, an array indexed by track position for build/trade.
// resource is OneOrArray<Resource>: a scalar for most benefits, an array indexed by track position for trade benefits.
export type Benefit = {
  description: string,
  type: ColonyBenefit;
  quantity: OneOrArray<number>;
  resource?: OneOrArray<Resource>;
}

export type ColonyMetadata = Readonly<{
  module?: GameModule; // TODO(kberg): attach gameModule to the server colonies themselves.
  name: ColonyName;
  build: Benefit, // Default quantity is [1,1,1]
  trade: Benefit, // Default quantity is [1,1,1,1,1,1,1]
  colony: Benefit, // Default quantity is 1
  cardResource?: CardResource,
  expansion: Expansion | undefined,

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

type InputBenefit = {
  description: string,
  type: ColonyBenefit,
  quantity?: OneOrArray<number>,
  resource?: OneOrArray<Resource>,
}

export type InputColonyMetadata = {
  module?: ColonyMetadata['module'],
  name: ColonyMetadata['name'];
  build: InputBenefit,
  trade: InputBenefit,
  colony: InputBenefit,
  cardResource?: CardResource,
  expansion?: Expansion,
} & Partial<{
  shouldIncreaseTrack: ColonyMetadata['shouldIncreaseTrack'],
}>;

const DEFAULT_BUILD_QUANTITY = [1, 1, 1];
const DEFAULT_TRADE_QUANTITY = [1, 1, 1, 1, 1, 1, 1];

export function benefitMetadata(partial: InputBenefit, defaultQuantity: OneOrArray<number>): Benefit {
  return {
    ...partial,
    quantity: partial.quantity ?? defaultQuantity,
  };
}

export function colonyMetadata(partial: InputColonyMetadata): ColonyMetadata {
  return {
    expansion: partial.expansion,
    shouldIncreaseTrack: 'yes',
    ...partial,
    build: benefitMetadata(partial.build, DEFAULT_BUILD_QUANTITY),
    trade: benefitMetadata(partial.trade, DEFAULT_TRADE_QUANTITY),
    colony: benefitMetadata(partial.colony, 1),
  };
}
