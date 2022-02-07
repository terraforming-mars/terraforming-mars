import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class Mohole extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOHOLE,
      tags: [Tags.BUILDING],
      productionBox: Units.of({heat: 3}),

      metadata: {
        cardNumber: 'P22',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(3)).br;
          b.heat(3);
        }),
        description: 'Increase your heat production 3 steps. Gain 3 heat.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.HEAT, 3);
    player.heat += 3;
    return undefined;
  }
}
