import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {digit} from '../Options';

export class Hadesphere extends ActionCard implements IActionCard, ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.HADESPHERE,
      tags: [Tag.BUILDING],
      startingMegaCredits: 36,

      behavior: {
        stock: {steel: 5},
      },

      action: {
        underworld: {excavate: 1},
      },

      firstAction: {
        text: 'Identify any 3 underground resources on Mars.',
        underworld: {
          identify: 3,
        },
      },

      metadata: {
        cardNumber: 'UC01',
        description: 'You start with 36M€ and 5 steel. As your first action, identify any 3 underground resources on Mars.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(36).steel(5, {digit}).identify(3, {digit}).br;
          b.corpBox('action', (ce) => {
            ce.action('Excavate an underground resource.', (ab) => {
              ab.empty().startAction.excavate(1);
            });
          });
        }),
      },
    });
  }
}
