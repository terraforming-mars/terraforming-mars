import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../../common/GlobalParameter';

export class MorningStarInc extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.MORNING_STAR_INC,
      tags: [Tag.VENUS],
      startingMegaCredits: 50,
      type: CardType.CORPORATION,
      globalParameterRequirementBonus: {steps: 2, parameter: GlobalParameter.VENUS},

      firstAction: {
        text: 'Draw 3 cards with a Venus tag',
        drawCard: {count: 3, tag: Tag.VENUS},
      },

      metadata: {
        cardNumber: 'R06',
        description: 'You start with 50 M€. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(50).nbsp.cards(3, {secondaryTag: Tag.VENUS});
          b.corpBox('effect', (ce) => {
            ce.effect('Your Venus requirements are +/- 2 steps, your choice in each case.', (eb) => {
              eb.plate('Venus requirements').startEffect.text('+/- 2');
            });
          });
        }),
      },
    });
  }
}
