import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class MartianIndustries extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.MARTIAN_INDUSTRIES;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.STEEL);
      player.megaCredits += 6;
      return undefined;
    }
}

