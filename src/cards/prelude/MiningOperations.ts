import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class MiningOperations extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.MINING_OPERATIONS;
    public play(player: Player) {
      player.addProduction(Resources.STEEL, 2);
      player.steel += 4;
      return undefined;
    }
}
