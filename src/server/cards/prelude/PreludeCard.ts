import {Card, StaticCardProperties} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {Behavior} from '../../behavior/Behavior';
import {IPreludeCard} from './IPreludeCard';
import {CardResource} from '../../../common/CardResource';

export interface StaticPreludeProperties {
    metadata: ICardMetadata;
    name: CardName;
    tags?: Array<Tag>;
    tilesBuilt?: Array<TileType>,
    behavior?: Partial<Behavior>,
    startingMegacredits?: number,

    // For Prelude 2
    resourceType?: CardResource;
  }

export abstract class PreludeCard extends Card implements IPreludeCard {
  constructor(properties: StaticPreludeProperties) {
    const startingMegaCredits = properties.startingMegacredits ?? properties.behavior?.stock?.megacredits;
    if (typeof(startingMegaCredits) === 'object') {
      throw new Error('Cannot have a Countable for a Prelude stock MC: ' + properties.name);
    }
    const obj: StaticCardProperties = {
      behavior: properties.behavior,
      type: CardType.PRELUDE,
      name: properties.name,
      tags: properties.tags,
      metadata: properties.metadata,
      resourceType: properties.resourceType,
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
