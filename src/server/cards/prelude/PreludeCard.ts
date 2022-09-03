import {Card2} from '../Card';
import {CardType} from '../../../common/cards/CardType';
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

export abstract class PreludeCard extends Card2 implements IProjectCard {
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
}

/**
 * See Card2 for details
 */
export abstract class PreludeCard2 extends PreludeCard {
  constructor(properties: StaticPreludeProperties) {
    super(properties);
  }
  public override canPlay(player: Player) {
    if (this.requirements?.satisfies(player) === false) {
      return false;
    }
    if (this.productionBox && !player.production.canAdjust(this.productionBox)) {
      return false;
    }
    return this.bespokeCanPlay(player);
  }

  public bespokeCanPlay(_player: Player): boolean {
    return true;
  }

  public play(player: Player) {
    if (this.productionBox !== undefined) {
      player.production.adjust(this.productionBox);
    }
    return this.bespokePlay(player);
  }

  public bespokePlay(_player: Player): PlayerInput | undefined {
    return undefined;
  }
}

export function isPreludeCard(card: ICard): card is PreludeCard {
  return card instanceof PreludeCard;
}
