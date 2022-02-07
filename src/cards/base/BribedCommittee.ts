import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BribedCommittee extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BRIBED_COMMITTEE,
      tags: [Tags.EARTH],
      cost: 7,
      tr: {tr: 2},
      victoryPoints: -2,

      metadata: {
        cardNumber: '112',
        description: 'Raise your TR 2 steps.',
        renderData: CardRenderer.builder((b) => b.tr(2)),
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}
