import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class DomeFarming extends PreludeCard implements IProjectCard {
    public tags = [Tags.PLANT, Tags.STEEL];
    public name = CardName.DOME_FARMING;
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
}

