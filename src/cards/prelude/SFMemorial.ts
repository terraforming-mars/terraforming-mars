import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SFMemorial extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SF_MEMORIAL,
      tags: [Tags.BUILDING],
      cost: 7,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'P41',
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
