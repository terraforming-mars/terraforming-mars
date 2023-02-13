import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {Size} from '../../../common/cards/render/Size';

export class Yvonne extends CeoCard {
  constructor() {
    super({
      name: CardName.YVONNE,
      metadata: {
        cardNumber: 'L25',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('GAIN ALL YOUR COLONY BONUSES TWICE', Size.SMALL);
        }),
        description: 'Once per game, gain all your colony bonuses twice.',
      },
    });
  }


  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.game.gameOptions.coloniesExtension === true;
  }

  public action(player: Player): PlayerInput | undefined {
    player.game.colonies.forEach((colony) => {
      colony.colonies.filter((owner) => owner === player.id).forEach((owner) => {
        player.game.defer(new SimpleDeferredAction(player, () => colony.giveColonyBonus(player.game.getPlayerById(owner))));
        player.game.defer(new SimpleDeferredAction(player, () => colony.giveColonyBonus(player.game.getPlayerById(owner))));
      });
    });
    this.isDisabled = true;
    return undefined;
  }
}
