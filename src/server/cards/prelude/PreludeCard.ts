import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {TileType} from '../../../common/TileType';
import {ICard} from '../ICard';
import {Behavior} from '../../behavior/Behavior';

interface StaticPreludeProperties {
    metadata: ICardMetadata;
    name: CardName;
    tags?: Array<Tag>;
    startingMegacredits?: number;
    tilesBuilt?: Array<TileType.MOON_COLONY | TileType.MOON_MINE | TileType.MOON_ROAD>,
    behavior?: Partial<Behavior>,
}

export abstract class PreludeCard extends Card implements IProjectCard {
  constructor(properties: StaticPreludeProperties) {
    super({
      behavior: properties.behavior,
      cardType: CardType.PRELUDE,
      name: properties.name,
      tags: properties.tags,
      metadata: properties.metadata,
      startingMegaCredits: properties.startingMegacredits,
    });
  }
}

export function isPreludeCard(card: ICard): card is PreludeCard {
  return card instanceof PreludeCard;
}
