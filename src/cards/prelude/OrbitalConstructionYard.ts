import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalConstructionYard extends PreludeCard implements IProjectCard {
    public tags = [Tags.SPACE];
    public name = CardName.ORBITAL_CONSTRUCTION_YARD;
    public play(player: Player) {
      player.addProduction(Resources.TITANIUM);
      player.titanium += 4;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P25',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.titanium(1)).br;
        b.titanium(4);
      }),
      description: 'Increase your titanium production 1 step. Gain 4 titanium.',
    }
}
