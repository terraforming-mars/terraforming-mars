import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Mohole extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOHOLE,
      tags: [Tag.BUILDING],
      productionBox: {heat: 3},

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
  public override bespokePlay(player: Player) {
    player.heat += 3;
    return undefined;
  }
}
