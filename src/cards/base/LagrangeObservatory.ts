import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LagrangeObservatory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAGRANGE_OBSERVATORY,
      tags: [Tags.SCIENCE, Tags.SPACE],
      cost: 9,
      victoryPoints: 1,

      metadata: {
        cardNumber: '196',
        renderData: CardRenderer.builder((b) => b.cards(1)),
        description: 'Draw 1 card.',
      },
    });
  }

  public play(player: Player) {
    player.drawCard();
    return undefined;
  }
}
