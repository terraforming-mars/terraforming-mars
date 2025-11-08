import {CorporationCard} from './CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from './ICorporationCard';

export class Inventrix extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.INVENTRIX,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 45,
      globalParameterRequirementBonus: {steps: 2},

      firstAction: {
        text: 'Draw 3 cards',
        drawCard: 3,
      },

      metadata: {
        cardNumber: 'R43',
        description: 'As your first action in the game, draw 3 cards. Start with 45 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(45).nbsp.cards(3);
          b.corpBox('effect', (ce) => {
            ce.effect('Your temperature, oxygen, ocean, and Venus requirements are +2 or -2 steps, your choice in each case.', (eb) => {
              eb.plate('Global requirements').startEffect.text('+/- 2');
            });
          });
        }),
      },
    });
  }
}

