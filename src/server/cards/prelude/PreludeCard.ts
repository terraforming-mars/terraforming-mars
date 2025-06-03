import {Card, StaticCardProperties} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardMetadata} from '../../../common/cards/CardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {Behavior} from '../../behavior/Behavior';
import {IPreludeCard} from './IPreludeCard';
import {CardResource} from '../../../common/CardResource';
import {IVictoryPoints} from '../../../common/cards/IVictoryPoints';
import {CardDiscount, GlobalParameterRequirementBonus} from '../../../common/cards/Types';
import {OneOrArray} from '../../../common/utils/types';
import {TRSource} from '../../../common/cards/TRSource';

export type StaticPreludeProperties = {
  action?: Behavior;
  behavior?: Partial<Behavior>,
  globalParameterRequirementBonus?: GlobalParameterRequirementBonus;
  metadata: CardMetadata;
  name: CardName;
  tags?: Array<Tag>;
  tilesBuilt?: ReadonlyArray<TileType>,
  resourceType?: CardResource;
  startingMegacredits?: number,
  victoryPoints?: number | 'special' | IVictoryPoints,
  cardDiscount?: OneOrArray<CardDiscount>;
  /**
   * Describes where the card's TR comes from.
   *
   * No need to be explicit about this if all the TR raising
   * comes from `behavior`.
   */
  tr?: TRSource;
}

export abstract class PreludeCard extends Card implements IPreludeCard {
  constructor(properties: StaticPreludeProperties) {
    const startingMegaCredits = properties.startingMegacredits ?? properties.behavior?.stock?.megacredits;
    if (typeof(startingMegaCredits) === 'object') {
      throw new Error('Cannot have a Countable for a Prelude stock MC: ' + properties.name);
    }
    const obj: StaticCardProperties = {
      action: properties.action,
      behavior: properties.behavior,
      type: CardType.PRELUDE,
      name: properties.name,
      tags: properties.tags,
      globalParameterRequirementBonus: properties.globalParameterRequirementBonus,
      metadata: properties.metadata,
      resourceType: properties.resourceType,
      tilesBuilt: properties.tilesBuilt,
      victoryPoints: properties.victoryPoints,
      cardDiscount: properties.cardDiscount,
      tr: properties.tr,
    };
    if (startingMegaCredits !== undefined) {
      obj.startingMegaCredits = startingMegaCredits;
    }
    super(obj);
  }
  public override get type(): CardType.PRELUDE {
    return CardType.PRELUDE;
  }
}
