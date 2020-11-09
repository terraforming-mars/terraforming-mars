import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class OrbitalConstructionYard extends PreludeCard implements IProjectCard {
    public tags = [Tags.SPACE];
    public name = CardName.ORBITAL_CONSTRUCTION_YARD;
    public play(player: Player) {
      player.addProduction(Resources.TITANIUM);
      player.titanium += 4;
      return undefined;
    }
}
