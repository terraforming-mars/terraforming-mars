import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Resource} from '../../../common/Resource';

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

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    player.production.add(Resource.PLANTS, 1, {log: true});
    player.production.add(Resource.HEAT, 1, {log: true});
    player.stock.add(Resource.PLANTS, player.production.plants + 4, {log: true});
    player.stock.add(Resource.HEAT, player.production.heat + 4, {log: true});
    return undefined;
  }
}
