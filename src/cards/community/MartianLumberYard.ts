import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';

export class MartianLumberYard extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.MARTIAN_LUMBER_YARD;

    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      player.addProduction(Resources.PLANTS);
      player.setResource(Resources.STEEL, 2);
      player.setResource(Resources.PLANTS, 3);
      return undefined;
    }
}

