import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
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


  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.game.gameOptions.coloniesExtension === true;
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    player.game.colonies.forEach((colony) => {
      colony.colonies.filter((owner) => owner === player.id).forEach((owner) => {
        player.defer(() => colony.giveColonyBonus(player.game.getPlayerById(owner)));
        player.defer(() => colony.giveColonyBonus(player.game.getPlayerById(owner)));
      });
    });
    return undefined;
  }
}
