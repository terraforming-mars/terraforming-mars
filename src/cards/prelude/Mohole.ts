import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class Mohole extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.MOHOLE;
    public play(player: Player) {
      player.addProduction(Resources.HEAT, 3);
      player.heat += 3;
      return undefined;
    }
}
