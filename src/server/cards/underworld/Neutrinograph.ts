import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {cancelled, digit} from '../Options';

export class Neutrinograph extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.NEUTRINOGRAPH,
      tags: [Tag.SCIENCE],
      cost: 10,

      requirements: {tag: Tag.SCIENCE, count: 4},
      victoryPoints: 2,

      behavior: {
        underworld: {identify: 2},
      },

      metadata: {
        cardNumber: 'U57',
        renderData: CardRenderer.builder((b) => {
          b.effect('When identifying underground resources EXCEPT by placing a tile or excavating, ' +
          'you can re-identify spaces that already have an unclaimed token. ' +
          'When you do, replace that token with a new one.', (eb) => {
            eb.identify().startEffect.undergroundResources(1, {cancelled}).asterix();
          }).br;
          b.identify(2, {digit}).br;
        }),
        description: 'Requires 4 science tags. Identify 2 underground resources.',
      },
    });
  }
}
