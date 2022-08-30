import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard2} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalConstructionYard extends PreludeCard2 implements IProjectCard {
  constructor() {
    super({
      name: CardName.ORBITAL_CONSTRUCTION_YARD,
      tags: [Tag.SPACE],
      productionBox: {titanium: 1},

      metadata: {
        cardNumber: 'P25',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).br;
          b.titanium(4);
        }),
        description: 'Increase your titanium production 1 step. Gain 4 titanium.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.titanium += 4;
    return undefined;
  }
}
