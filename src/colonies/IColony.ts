import {Player} from '@/Player';
import {PlayerInput} from '@/PlayerInput';
import {ColonyName} from '../common/colonies/ColonyName';
import {ShouldIncreaseTrack} from '../common/colonies/ShouldIncreaseTrack';
import {Resources} from '../common/Resources';
import {ResourceType} from '../common/ResourceType';
import {PlayerId} from '../common/Types';
import {Game} from '../Game';
import {ColonyBenefit} from './ColonyBenefit';

export type TradeOptions = {
  usesTradeFleet?: boolean;
  decreaseTrackAfterTrade?: boolean;
  giveColonyBonuses?: boolean;
  selfishTrade?: boolean;
};

export interface IColony {
  name: ColonyName;
  isActive: boolean;
  colonies: Array<PlayerId>;
  resourceType?: ResourceType;
  trackPosition: number;
  visitor: PlayerId | undefined;

  buildType: ColonyBenefit;
  buildQuantity: Array<number>;
  buildResource?: Resources;
  tradeType: ColonyBenefit;
  tradeQuantity: Array<number>;
  tradeResource?: Resources | Array<Resources>;
  colonyBonusType: ColonyBenefit;
  colonyBonusQuantity: number;
  colonyBonusResource?: Resources;
  shouldIncreaseTrack: ShouldIncreaseTrack;

  endGeneration(game: Game): void;
  increaseTrack(steps?: number): void;
  decreaseTrack(steps?: number): void;
  isColonyFull(): boolean;
  addColony(player: Player, options?: {giveBonusTwice: boolean}): void;
  trade(player: Player, tradeOptions?: TradeOptions, bonusTradeOffset?: number): void;
  giveColonyBonus(player: Player, isGiveColonyBonus?: boolean): undefined | PlayerInput;
}
