import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class WaterToVenus extends Card {
  constructor() {
    super({
      name: CardName.WATER_TO_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 9,
      tr: {venus: 1},

      metadata: {
        cardNumber: '254',
        renderData: CardRenderer.builder((b) => b.venus(1)),
        description: 'Raise Venus 1 step.',
      },
    });
  };

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
