import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ReleaseOfInertGases extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.RELEASE_OF_INERT_GASES,
      cost: 14,
      tr: {tr: 2},

      metadata: {
        cardNumber: '036',
        renderData: CardRenderer.builder((b) => {
          b.tr(2);
        }),
        description: 'Raise your terraforming rating 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}
