import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class AlliedBanks extends PreludeCard implements IProjectCard {
    public tags = [Tags.EARTH];
    public name = CardName.ALLIED_BANKS;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 4);
      player.megaCredits += 3;
      return undefined;
    }
}

