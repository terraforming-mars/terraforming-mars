import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalConstructionYard extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.ORBITAL_CONSTRUCTION_YARD,
      tags: [Tags.SPACE],

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
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    player.titanium += 4;
    return undefined;
  }
}
