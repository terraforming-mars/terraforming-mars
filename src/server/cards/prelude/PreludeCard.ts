import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {Units} from '../../../common/Units';
import {ICard} from '../ICard';

interface StaticPreludeProperties {
    metadata: ICardMetadata;
    name: CardName;
    tags?: Array<Tag>;
    startingMegacredits?: number;
    productionBox?: Partial<Units>;
}

export abstract class PreludeCard extends Card implements IProjectCard {
  constructor(properties: StaticPreludeProperties) {
    super({
      cardType: CardType.PRELUDE,
      name: properties.name,
      tags: properties.tags,
      metadata: properties.metadata,
      productionBox: properties.productionBox,
      startingMegaCredits: properties.startingMegacredits,
    });
  }
  public abstract play(player: Player): PlayerInput | undefined;
  public override canPlay(_player: Player): boolean {
    return true;
  }
}

export function isPreludeCard(card: ICard): card is PreludeCard {
  return card instanceof PreludeCard;
}
