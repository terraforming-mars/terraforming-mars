import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {Behavior} from '../../behavior/Behavior';
import {IPreludeCard} from './IPreludeCard';

interface StaticPreludeProperties {
    metadata: ICardMetadata;
    name: CardName;
    tags?: Array<Tag>;
    startingMegacredits?: number;
    tilesBuilt?: Array<TileType.MOON_HABITAT | TileType.MOON_MINE | TileType.MOON_ROAD>,
    behavior?: Partial<Behavior>,
}

export abstract class PreludeCard extends Card implements IPreludeCard {
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
  public override get cardType(): CardType.PRELUDE {
    return CardType.PRELUDE;
  }
}
