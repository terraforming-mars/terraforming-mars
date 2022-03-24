import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class MiningOperations extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.MINING_OPERATIONS,
      tags: [Tags.BUILDING],
      productionBox: Units.of({steel: 2}),

      metadata: {
        cardNumber: 'P21',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(2)).br;
          b.steel(4);
        }),
        description: 'Increase your steel production 2 steps. Gain 4 steel.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.STEEL, 2);
    player.steel += 4;
    return undefined;
  }
}
