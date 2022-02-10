import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class GiantSolarShade extends Card {
  constructor() {
    super({
      name: CardName.GIANT_SOLAR_SHADE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SPACE, Tags.VENUS],
      cost: 27,
      tr: {venus: 3},

      metadata: {
        cardNumber: '229',
        renderData: CardRenderer.builder((b) => b.venus(3)),
        description: 'Raise Venus 3 steps.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 3);
    return undefined;
  }
}

