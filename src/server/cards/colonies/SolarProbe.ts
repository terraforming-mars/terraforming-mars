import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit, played} from '../Options';

export class SolarProbe extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 9,
      tags: [Tag.SPACE, Tag.SCIENCE],
      name: CardName.SOLAR_PROBE,
      cardType: CardType.EVENT,
      victoryPoints: 1,

      behavior: {
        drawCard: {count: {tag: Tag.SCIENCE, per: 3}},
      },

      metadata: {
        cardNumber: 'C37',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).slash().science(3, {digit, played});
        }),
        description: 'Draw 1 card for every 3 science tags you have, including this.',
      },
    });
  }
}
