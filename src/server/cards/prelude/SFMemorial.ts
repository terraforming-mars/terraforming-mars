import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SFMemorial extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SF_MEMORIAL,
      tags: [Tag.BUILDING],
      cost: 7,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'P41',
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
