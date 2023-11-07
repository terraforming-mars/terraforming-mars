import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class TunnelBoringMachine extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.TUNNEL_BORING_MACHINE,
      tags: [Tag.BUILDING],
      cost: 10,

      action: {
        spend: {energy: 3},
        underworld: {excavate: 2},
      },

      metadata: {
        cardNumber: 'U03',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 3 energy to excavate 2 underground resources',
            (ab) => ab.energy(3, {digit}).startAction.excavate(2));
        }),
      },
    });
  }
}
