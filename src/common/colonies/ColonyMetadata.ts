import {ColonyBenefit} from './ColonyBenefit';
import {Resource} from '../Resource';
import {ColonyName} from './ColonyName';
import {CardResource} from '../CardResource';
import {Expansion, GameModule} from '../cards/GameModule';
import {OneOrArray} from '../utils/types';

type Benefit<S, T> = {
  description: string,
  type: ColonyBenefit;
  quantity: S
  resource?: T;
}

export type ColonyMetadata = Readonly<{
  module?: GameModule; // TODO(kberg): attach gameModule to the server colonies themselves.
  name: ColonyName;
  build: Benefit<Array<number>, Resource>, // Default is [1,1,1]
  trade: Benefit<Array<number>, OneOrArray<Resource>>, // Default is [1,1,1,1,1,1,1]
  colony: Benefit<number, Resource>, // Default is 1
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

type InputBenefit<T extends Benefit<any, any>> = {
  description: string,
  type: ColonyBenefit,
  quantity?: T['quantity'],
  resource?: T['resource'],
}
// {[P in Exclude<keyof T, 'quantity'>]: T[P]} &
// {quantity?: T['quantity']};

export type InputColonyMetadata = {
  module?: ColonyMetadata['module'],
  name: ColonyMetadata['name'];
  build: InputBenefit<ColonyMetadata['build']>,
  trade: InputBenefit<ColonyMetadata['trade']>,
  colony: InputBenefit<ColonyMetadata['colony']>,
  cardResource?: CardResource,
  expansion?: Expansion,
} & Partial<{
  shouldIncreaseTrack: ColonyMetadata['shouldIncreaseTrack'],
}>;

const DEFAULT_BUILD_QUANTITY = [1, 1, 1];
const DEFAULT_TRADE_QUANTITY = [1, 1, 1, 1, 1, 1, 1];

export function benefitMetadata<S, T>(partial: InputBenefit<Benefit<S, T>>, defaultQuantity: S): Benefit<S, T> {
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
