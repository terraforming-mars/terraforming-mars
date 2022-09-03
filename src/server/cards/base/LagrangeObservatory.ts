import {Card2} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LagrangeObservatory extends Card2 implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAGRANGE_OBSERVATORY,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 9,
      victoryPoints: 1,

      metadata: {
        cardNumber: '196',
        renderData: CardRenderer.builder((b) => b.cards(1)),
        description: 'Draw 1 card.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.drawCard();
    return undefined;
  }
}
