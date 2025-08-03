import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';
import {digit} from '../Options';

export class Microgravimetry extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MICROGRAVIMETRY,
      tags: [Tag.POWER, Tag.SCIENCE],
      cost: 5,
      victoryPoints: 1,

      action: {
        spend: {energy: 2},
        underworld: {identify: {count: 3, claim: 1}},
      },

      metadata: {
        cardNumber: 'U042',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 energy identify 3 underground resources. Then claim 1 of them.',
            (ab) => ab.energy(2, {digit}).startAction.identify(3, {digit}).claim(1),
          );
        }),
      },
    });
  }
}
