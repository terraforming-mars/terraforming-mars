import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {Card} from '../Card';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class JovianEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.JOVIAN_EMBASSY,
      tags: [Tags.JOVIAN, Tags.BUILDING],
      cost: 14,
      tr: {tr: 1},
      victoryPoints: 1,

      metadata: {
        cardNumber: 'X23',
        renderData: CardRenderer.builder((b) => {
          b.tr(1);
        }),
        description: 'Raise your TR 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRating();
    return undefined;
  }
}
