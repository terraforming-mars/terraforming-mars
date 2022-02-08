import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {ICardMetadata} from '../ICardMetadata';
import {CardName} from '../../common/cards/CardName';
import {Tags} from '../../common/cards/Tags';
import {IProjectCard} from '../IProjectCard';
import {Units} from '../../common/Units';

interface StaticPreludeProperties {
    metadata: ICardMetadata;
    name: CardName;
    tags?: Array<Tags>;
    startingMegacredits?: number;
    productionBox?: Units;
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
