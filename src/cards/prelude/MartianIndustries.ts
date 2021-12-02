import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class MartianIndustries extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARTIAN_INDUSTRIES,
      tags: [Tags.BUILDING],
      productionBox: Units.of({energy: 1, steel: 1}),
      startingMegacredits: 6,

      metadata: {
        cardNumber: 'P18',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).steel(1)).br;
          b.megacredits(6);
        }),
        description: 'Increase your energy and steel production 1 step. Gain 6 M€.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    player.addProduction(Resources.STEEL, 1);
    player.megaCredits += 6;
    return undefined;
  }
}

