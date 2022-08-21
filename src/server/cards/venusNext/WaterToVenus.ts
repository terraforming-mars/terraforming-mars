import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class WaterToVenus extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.WATER_TO_VENUS,
      cardType: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 9,
      tr: {venus: 1},

      metadata: {
        cardNumber: '254',
        renderData: CardRenderer.builder((b) => b.venus(1)),
        description: 'Raise Venus 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
