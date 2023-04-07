import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Resources} from '../../../common/Resources';

export class Clarke extends CeoCard {
  constructor() {
    super({
      name: CardName.CLARKE,
      metadata: {
        cardNumber: 'L03',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY').br;
          b.production((pb) => pb.plants(1).heat(1));
          b.text('X+4').plants(1).heat(1).asterix();
        }),
        description: 'Once per game, increase your plant and heat production 1 step each. Gain plants and heat equal to your production +4.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    player.production.add(Resources.PLANTS, 1, {log: true});
    player.production.add(Resources.HEAT, 1, {log: true});
    player.addResource(Resources.PLANTS, player.production.plants + 4, {log: true});
    player.addResource(Resources.HEAT, player.production.heat + 4, {log: true});
    return undefined;
  }
}
