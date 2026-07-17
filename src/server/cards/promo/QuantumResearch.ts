import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '@/server/IPlayer';

export class QuantumResearch extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.QUANTUM_RESEARCH,
      tags: [Tag.WILD],
      cost: 11,

      requirements: {
        tag: Tag.SCIENCE,
        count: 4,
      },

      metadata: {
        description: 'Requires 4 science tags.',
        cardNumber: 'X-4',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you buy a card to hand, you pay 1 MC less for it.', (eb) => {
            eb.cards(1).asterix().startEffect.megacredits(-1);
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.cardCost--;
    return undefined;
  }
  public override bespokeOnDiscard(player: IPlayer): void {
    player.cardCost++;
    return undefined;
  }
}
