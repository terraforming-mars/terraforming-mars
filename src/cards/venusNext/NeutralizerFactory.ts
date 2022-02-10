import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class NeutralizerFactory extends Card {
  constructor() {
    super({
      name: CardName.NEUTRALIZER_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS],
      cost: 7,
      tr: {venus: 1},

      requirements: CardRequirements.builder((b) => b.venus(10)),
      metadata: {
        cardNumber: '240',
        renderData: CardRenderer.builder((b) => {
          b.venus(1);
        }),
        description: 'Requires Venus 10%. Increase the Venus track 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
