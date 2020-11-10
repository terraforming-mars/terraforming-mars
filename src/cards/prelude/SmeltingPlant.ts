import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';

export class SmeltingPlant extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.SMELTING_PLANT;
    public play(player: Player, game: Game) {
      player.steel += 5;
      return game.increaseOxygenLevel(player, 2);
    }
}
