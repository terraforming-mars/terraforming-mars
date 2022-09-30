import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class MercurianAlloys extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MERCURIAN_ALLOYS,
      tags: [Tag.SPACE],
      cost: 3,

      behavior: {
        titanumValue: 1,
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)),
      metadata: {
        cardNumber: 'X07',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your titanium resources are worth 1 M€ extra.', (eb) => {
            eb.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
          });
        }),
        description: 'Requires 2 science tags.',
      },
    });
  }
}
