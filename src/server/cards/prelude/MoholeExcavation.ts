import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeExcavation extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOHOLE_EXCAVATION,
      tags: [Tag.BUILDING],
      productionBox: {steel: 1, heat: 2},

      metadata: {
        cardNumber: 'P23',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.steel(1).br;
            pb.heat(2);
          }).heat(2);
        }),
        description: 'Increase your steel production 1 step and heat production 2 steps. Gain 2 heat.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.heat += 2;
    return undefined;
  }
}
