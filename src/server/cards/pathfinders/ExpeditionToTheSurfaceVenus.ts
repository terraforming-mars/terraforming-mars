import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {played} from '../Options';

export class ExpeditionToTheSurfaceVenus extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.EXPEDITION_TO_THE_SURFACE_VENUS,
      cost: 16,
      tags: [Tag.VENUS],

      behavior: {
        drawCard: 2,
        global: {venus: 1},
        stock: {megacredits: {tag: Tag.VENUS}},
      },

      metadata: {
        cardNumber: 'Pf46',
        renderData: CardRenderer.builder((b) => {
          b.cards(2).venus(1).br;
          b.megacredits(1).slash().venus(1, {played});
        }),
        description: 'Draw 2 cards. Raise Venus 1 step. Gain 1M€ for each of your Venus tags, including this.',
      },
    });
  }
}

